import { Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';

@Injectable()
export class GeofencingService {
  async isInServiceZone(lat: number, lng: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count FROM service_zones
        WHERE is_active = true
          AND ST_Within(
            ST_MakePoint(${lng}, ${lat})::geography::geometry,
            boundary
          )
      `;
      return Number(result[0]?.count ?? 0) > 0;
    } catch {
      return true; // fallback: allow all locations in MVP
    }
  }

  async getActiveZones() {
    return prisma.serviceZone.findMany({ where: { isActive: true } });
  }
}
