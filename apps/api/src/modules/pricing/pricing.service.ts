import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { prisma, type PricingRule, type PricingZone } from '@rapide/database';
import type { PriceEstimate } from '@rapide/types';
import { estimateDeliveryMinutes, haversineDistance, roundFare } from '@rapide/utils';
import type { PriceEstimateDto } from './dto/price-estimate.dto';
import { PricingZoneService } from './pricing-zone.service';

const PLATFORM_FEE_RATE = 0.20;

@Injectable()
export class PricingService {
  constructor(
    private readonly zoneService: PricingZoneService,
    private readonly config: ConfigService,
  ) {}

  async estimatePrice(dto: PriceEstimateDto): Promise<PriceEstimate> {
    const zone = await this.zoneService.findZoneForCoords(dto.pickupLat, dto.pickupLng);
    if (!zone) throw new NotFoundException('No active pricing zone for this location');

    const distanceKm = haversineDistance(
      { latitude: dto.pickupLat, longitude: dto.pickupLng },
      { latitude: dto.dropoffLat, longitude: dto.dropoffLng },
    );

    const rules = await prisma.pricingRule.findMany({
      where: { zoneId: zone.id, isActive: true },
      orderBy: { priority: 'desc' },
    });

    const baseFare = Number(zone.baseFare);
    const distanceFare = distanceKm * Number(zone.perKmRate);
    let subtotal = baseFare + distanceFare;

    // Apply multiplier rules (priority, insurance, time-of-day)
    let combinedMultiplier = 1.0;
    let addedFees = 0;
    let priorityPremium = 0;
    let insuranceFee = 0;
    let weightSurcharge = 0;

    for (const rule of rules) {
      if (!this.evaluateCondition(rule, dto)) continue;

      if (rule.multiplier) {
        if (rule.ruleType === 'priority') {
          priorityPremium = subtotal * (Number(rule.multiplier) - 1);
        } else if (rule.ruleType === 'insurance') {
          insuranceFee = Math.max(500, subtotal * (Number(rule.multiplier) - 1));
        } else {
          combinedMultiplier *= Number(rule.multiplier);
        }
      }
      if (rule.addedFee) {
        if (rule.ruleType === 'weight') {
          weightSurcharge += Number(rule.addedFee);
        } else {
          addedFees += Number(rule.addedFee);
        }
      }
    }

    // Surge multiplier from external state (Redis in production)
    const surgeMultiplier = 1.0; // loaded by tracking module at runtime

    const totalBeforeOptions = subtotal * combinedMultiplier * surgeMultiplier;
    const totalFare = roundFare(
      totalBeforeOptions +
        (dto.isPriority ? priorityPremium : 0) +
        (dto.isInsured ? insuranceFee : 0) +
        weightSurcharge +
        addedFees,
    );
    const minFare = Number(zone.minFare);
    const finalFare = Math.max(totalFare, minFare);

    const platformFee = Math.round(finalFare * PLATFORM_FEE_RATE);
    const riderEarning = finalFare - platformFee;

    return {
      baseFare: Math.round(baseFare),
      distanceFare: Math.round(distanceFare),
      weightSurcharge: Math.round(weightSurcharge),
      surgeMultiplier,
      priorityPremium: dto.isPriority ? Math.round(priorityPremium) : 0,
      insuranceFee: dto.isInsured ? Math.round(insuranceFee) : 0,
      totalFare: finalFare,
      platformFee,
      riderEarning,
      currency: 'XOF',
      distanceKm: Math.round(distanceKm * 100) / 100,
      estimatedMinutes: estimateDeliveryMinutes(distanceKm),
      surgeActive: surgeMultiplier > 1,
    };
  }

  private evaluateCondition(rule: PricingRule, dto: PriceEstimateDto): boolean {
    const condition = rule.condition as { operator: string; value: unknown };
    switch (rule.ruleType) {
      case 'weight':
        if (!dto.weightKg) return false;
        if (condition.operator === 'gte') return dto.weightKg >= Number(condition.value);
        if (condition.operator === 'lte') return dto.weightKg <= Number(condition.value);
        return false;
      case 'priority':
        return dto.isPriority === true;
      case 'insurance':
        return dto.isInsured === true;
      case 'category':
        if (condition.operator === 'in') {
          return Array.isArray(condition.value) && condition.value.includes(dto.parcelCategory);
        }
        return dto.parcelCategory === condition.value;
      case 'time_of_day': {
        const hour = new Date().getHours();
        const [start, end] = condition.value as [number, number];
        return hour >= start && hour < end;
      }
      default:
        return false;
    }
  }
}
