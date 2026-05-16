import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { prisma } from '@rapide/database';
import type { RiderLocationPayload } from '@rapide/types';
import Redis from 'ioredis';

@Injectable()
export class TrackingService {
  private readonly redis: Redis;
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly config: ConfigService) {
    this.redis = new Redis(config.get('REDIS_URL', 'redis://localhost:6379'));
  }

  async updateRiderLocation(payload: RiderLocationPayload): Promise<void> {
    const key = `rider:location:${payload.riderId}`;

    // Store current position in Redis with 60s TTL
    await this.redis.hset(key, {
      lat: payload.latitude.toString(),
      lng: payload.longitude.toString(),
      heading: (payload.heading ?? 0).toString(),
      speed: (payload.speed ?? 0).toString(),
      ts: payload.timestamp.toString(),
    });
    await this.redis.expire(key, 60);

    // Also update rider_location_cache table for PostGIS dispatch queries
    try {
      await prisma.$executeRaw`
        INSERT INTO rider_location_cache (rider_id, latitude, longitude, updated_at)
        VALUES (${payload.riderId}::uuid, ${payload.latitude}, ${payload.longitude}, NOW())
        ON CONFLICT (rider_id) DO UPDATE SET
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          updated_at = NOW()
      `;
    } catch {
      // Table may not exist yet in migration pipeline
    }

    // Async write to location history (fire-and-forget)
    prisma.riderLocationHistory.create({
      data: {
        riderId: payload.riderId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy: payload.accuracy,
        heading: payload.heading,
        speed: payload.speed,
        timestamp: new Date(payload.timestamp),
      },
    }).catch(() => {});
  }

  async getRiderLocation(riderId: string): Promise<RiderLocationPayload | null> {
    const data = await this.redis.hgetall(`rider:location:${riderId}`);
    if (!data.lat) return null;
    return {
      riderId,
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lng),
      accuracy: null,
      heading: parseFloat(data.heading ?? '0'),
      speed: parseFloat(data.speed ?? '0'),
      timestamp: parseInt(data.ts ?? '0'),
    };
  }

  async getRiderActiveDelivery(riderId: string): Promise<string | null> {
    const delivery = await prisma.delivery.findFirst({
      where: {
        riderId,
        status: {
          in: ['ASSIGNED', 'RIDER_EN_ROUTE_PICKUP', 'AT_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'AT_DROPOFF'],
        },
      },
      select: { id: true },
    });
    return delivery?.id ?? null;
  }

  async getSurgeMultiplier(zone: string): Promise<number> {
    const value = await this.redis.get(`surge:${zone}`);
    return value ? parseFloat(value) : 1.0;
  }

  async setSurgeMultiplier(zone: string, multiplier: number, ttlSeconds = 300) {
    await this.redis.setex(`surge:${zone}`, ttlSeconds, multiplier.toString());
    this.logger.log(`Surge set for ${zone}: ${multiplier}x`);
  }
}
