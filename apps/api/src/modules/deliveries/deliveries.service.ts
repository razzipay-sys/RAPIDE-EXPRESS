import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@rapide/database';
import { DeliveryStatus } from '@rapide/types';
import { generateTrackingCode } from '@rapide/utils';
import { randomInt } from 'crypto';

import { DispatchService } from '../dispatch/dispatch.service';
import { PricingService } from '../pricing/pricing.service';
import { WalletsService } from '../wallets/wallets.service';
import type { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveriesStateMachineService } from './deliveries-state-machine.service';

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly pricingService: PricingService,
    private readonly dispatchService: DispatchService,
    private readonly walletsService: WalletsService,
    private readonly stateMachine: DeliveriesStateMachineService,
  ) {}

  async create(customerId: string, dto: CreateDeliveryDto) {
    const estimate = await this.pricingService.estimatePrice({
      pickupLat: dto.pickupLat,
      pickupLng: dto.pickupLng,
      dropoffLat: dto.dropoffLat,
      dropoffLng: dto.dropoffLng,
      parcelCategory: dto.parcelCategory,
      weightKg: dto.weightKg,
      isPriority: dto.isPriority,
      isInsured: dto.isInsured,
    });

    // Generate 4-digit delivery OTP
    const deliveryOtp = randomInt(1000, 9999).toString();

    const delivery = await prisma.delivery.create({
      data: {
        trackingCode: generateTrackingCode(),
        status: DeliveryStatus.PENDING,
        customerId,

        pickupAddress: dto.pickupAddress,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
        pickupContactName: dto.pickupContactName,
        pickupContactPhone: dto.pickupContactPhone,

        dropoffAddress: dto.dropoffAddress,
        dropoffLat: dto.dropoffLat,
        dropoffLng: dto.dropoffLng,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,

        parcelCategory: dto.parcelCategory,
        weightKg: dto.weightKg,
        deliveryNotes: dto.deliveryNotes,

        distanceKm: estimate.distanceKm,
        baseFare: estimate.baseFare,
        distanceFare: estimate.distanceFare,
        surgeMultiplier: estimate.surgeMultiplier,
        priorityPremium: estimate.priorityPremium,
        insuranceFee: estimate.insuranceFee,
        totalFare: estimate.totalFare,
        platformFee: estimate.platformFee,
        riderEarning: estimate.riderEarning,

        isPriority: dto.isPriority ?? false,
        isInsured: dto.isInsured ?? false,
        isScheduled: dto.scheduledFor != null,
        scheduledFor: dto.scheduledFor,
        paymentMethod: dto.paymentMethod,

        deliveryOtp,
      },
    });

    // Create initial timeline entry
    await prisma.deliveryTimeline.create({
      data: {
        deliveryId: delivery.id,
        status: DeliveryStatus.PENDING,
        actorId: customerId,
        actorType: 'customer',
        description: 'Delivery created',
      },
    });

    // Queue dispatch
    if (!dto.scheduledFor) {
      await this.dispatchService.queueDelivery(delivery.id);
    }

    return delivery;
  }

  async findOne(id: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        timeline: { orderBy: { createdAt: 'asc' } },
        stops: { orderBy: { sequence: 'asc' } },
        rider: {
          include: { stats: true },
        },
      },
    });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async findByTrackingCode(code: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { trackingCode: code },
      include: { timeline: { orderBy: { createdAt: 'asc' } } },
    });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async findByCustomer(customerId: string, page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      prisma.delivery.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.delivery.count({ where: { customerId } }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(
    deliveryId: string,
    status: DeliveryStatus,
    actorId: string,
    actorType: string,
  ) {
    return this.stateMachine.transition(deliveryId, status, actorId, actorType);
  }
}
