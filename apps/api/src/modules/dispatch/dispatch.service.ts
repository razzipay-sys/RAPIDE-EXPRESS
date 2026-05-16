import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { prisma, type Delivery, type Rider } from '@rapide/database';

import { DISPATCH_QUEUE } from './dispatch.module';

const DISPATCH_RADIUS_METERS = 5000;  // 5 km initial radius
const DISPATCH_TIMEOUT_SECONDS = 30;
const MAX_DISPATCH_ATTEMPTS = 5;

interface CandidateRider {
  id: string;
  latitude: number;
  longitude: number;
  rating: number;
  acceptanceRate: number;
  completionRate: number;
  distanceMeters: number;
}

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(@InjectQueue(DISPATCH_QUEUE) private readonly dispatchQueue: Queue) {}

  async queueDelivery(deliveryId: string) {
    await this.dispatchQueue.add(
      'find-rider',
      { deliveryId, attempt: 1 },
      { attempts: MAX_DISPATCH_ATTEMPTS, backoff: { type: 'exponential', delay: 10000 } },
    );
    this.logger.log(`Queued dispatch for delivery ${deliveryId}`);
  }

  async findAndAssignRider(deliveryId: string): Promise<boolean> {
    const delivery = await prisma.delivery.findUniqueOrThrow({
      where: { id: deliveryId },
    });

    const candidates = await this.findNearbyRiders(
      Number(delivery.pickupLat),
      Number(delivery.pickupLng),
    );

    if (candidates.length === 0) {
      this.logger.warn(`No riders found near delivery ${deliveryId}`);
      return false;
    }

    // Score: 40% rating + 30% acceptance rate + 30% completion rate
    const scored = candidates
      .map((r) => ({
        ...r,
        score:
          r.rating * 0.4 +
          r.acceptanceRate * 100 * 0.3 +
          r.completionRate * 100 * 0.3 -
          (r.distanceMeters / 1000) * 2, // penalty per km
      }))
      .sort((a, b) => b.score - a.score);

    for (const candidate of scored.slice(0, 5)) {
      const accepted = await this.sendRequestToRider(delivery, candidate.id);
      if (accepted) {
        await this.assignRider(deliveryId, candidate.id);
        return true;
      }
    }

    return false;
  }

  private async findNearbyRiders(lat: number, lng: number): Promise<CandidateRider[]> {
    try {
      return await prisma.$queryRaw<CandidateRider[]>`
        SELECT
          r.id,
          rlc.latitude,
          rlc.longitude,
          CAST(r.rating AS FLOAT) AS rating,
          CAST(r.acceptance_rate AS FLOAT) AS "acceptanceRate",
          CAST(r.completion_rate AS FLOAT) AS "completionRate",
          ST_Distance(
            ST_MakePoint(rlc.longitude, rlc.latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography
          ) AS "distanceMeters"
        FROM riders r
        JOIN rider_location_cache rlc ON rlc.rider_id = r.id
        WHERE r.status = 'ACTIVE'
          AND r.online_status = 'online'
          AND ST_DWithin(
            ST_MakePoint(rlc.longitude, rlc.latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography,
            ${DISPATCH_RADIUS_METERS}
          )
        ORDER BY "distanceMeters" ASC
        LIMIT 10
      `;
    } catch {
      // rider_location_cache table may not exist yet — return empty
      this.logger.warn('rider_location_cache not available; skipping dispatch');
      return [];
    }
  }

  private async sendRequestToRider(delivery: Delivery, riderId: string): Promise<boolean> {
    const expiresAt = new Date(Date.now() + DISPATCH_TIMEOUT_SECONDS * 1000);

    const request = await prisma.dispatchRequest.create({
      data: {
        deliveryId: delivery.id,
        riderId,
        status: 'pending',
        expiresAt,
      },
    });

    // In production: emit WebSocket event to rider via TrackingGateway
    // await this.trackingGateway.sendToRider(riderId, WsEvent.NEW_DELIVERY_REQUEST, { ... });

    // Poll for response (simplified — production uses event-driven approach)
    const deadline = Date.now() + DISPATCH_TIMEOUT_SECONDS * 1000;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1000));
      const updated = await prisma.dispatchRequest.findUnique({ where: { id: request.id } });
      if (updated?.status === 'accepted') return true;
      if (updated?.status === 'rejected') return false;
    }

    // Expired
    await prisma.dispatchRequest.update({
      where: { id: request.id },
      data: { status: 'expired' },
    });
    return false;
  }

  private async assignRider(deliveryId: string, riderId: string) {
    await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        riderId,
        status: 'ASSIGNED',
        assignedAt: new Date(),
      },
    });

    await prisma.deliveryTimeline.create({
      data: {
        deliveryId,
        status: 'ASSIGNED',
        actorId: riderId,
        actorType: 'system',
        description: 'Rider assigned via dispatch',
      },
    });

    this.logger.log(`Assigned rider ${riderId} to delivery ${deliveryId}`);
  }
}
