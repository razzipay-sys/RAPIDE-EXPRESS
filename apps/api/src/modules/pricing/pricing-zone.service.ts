import { Injectable } from '@nestjs/common';
import { prisma, type PricingZone } from '@rapide/database';

@Injectable()
export class PricingZoneService {
  async findZoneForCoords(lat: number, lng: number): Promise<PricingZone | null> {
    // First attempt: PostGIS ST_Within check (requires geometry column added via migration)
    // Falls back to returning the first active zone (Cotonou) for MVP
    try {
      const result = await prisma.$queryRaw<PricingZone[]>`
        SELECT * FROM pricing_zones
        WHERE is_active = true
          AND ST_Within(
            ST_MakePoint(${lng}, ${lat})::geography::geometry,
            geometry
          )
        LIMIT 1
      `;
      if (result.length > 0) return result[0] ?? null;
    } catch {
      // PostGIS geometry column not yet added; fall through to default
    }

    return prisma.pricingZone.findFirst({
      where: { isActive: true, slug: 'cotonou' },
    });
  }

  async getAllZones() {
    return prisma.pricingZone.findMany({
      where: { isActive: true },
      include: { rules: { where: { isActive: true } } },
    });
  }
}
