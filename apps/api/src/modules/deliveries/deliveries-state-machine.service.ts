import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';
import { DeliveryStatus } from '@rapide/types';

type Transition = {
  from: DeliveryStatus[];
  to: DeliveryStatus;
};

const VALID_TRANSITIONS: Transition[] = [
  { from: [DeliveryStatus.DRAFT], to: DeliveryStatus.PENDING },
  { from: [DeliveryStatus.PENDING], to: DeliveryStatus.ASSIGNED },
  { from: [DeliveryStatus.ASSIGNED], to: DeliveryStatus.RIDER_EN_ROUTE_PICKUP },
  { from: [DeliveryStatus.RIDER_EN_ROUTE_PICKUP], to: DeliveryStatus.AT_PICKUP },
  { from: [DeliveryStatus.AT_PICKUP], to: DeliveryStatus.PICKED_UP },
  { from: [DeliveryStatus.PICKED_UP], to: DeliveryStatus.IN_TRANSIT },
  { from: [DeliveryStatus.IN_TRANSIT], to: DeliveryStatus.AT_DROPOFF },
  { from: [DeliveryStatus.AT_DROPOFF], to: DeliveryStatus.DELIVERED },
  {
    from: [DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED, DeliveryStatus.RIDER_EN_ROUTE_PICKUP],
    to: DeliveryStatus.CANCELLED,
  },
  {
    from: [DeliveryStatus.AT_PICKUP, DeliveryStatus.IN_TRANSIT, DeliveryStatus.AT_DROPOFF],
    to: DeliveryStatus.FAILED,
  },
  { from: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED], to: DeliveryStatus.REFUNDED },
];

@Injectable()
export class DeliveriesStateMachineService {
  isTransitionValid(from: DeliveryStatus, to: DeliveryStatus): boolean {
    return VALID_TRANSITIONS.some(
      (t) => t.to === to && t.from.includes(from),
    );
  }

  async transition(
    deliveryId: string,
    to: DeliveryStatus,
    actorId?: string,
    actorType?: string,
    meta?: { latitude?: number; longitude?: number; description?: string },
  ) {
    const delivery = await prisma.delivery.findUniqueOrThrow({ where: { id: deliveryId } });
    const from = delivery.status as DeliveryStatus;

    if (!this.isTransitionValid(from, to)) {
      throw new BadRequestException(
        `Cannot transition delivery from ${from} to ${to}`,
      );
    }

    const updates: Record<string, unknown> = { status: to };
    if (to === DeliveryStatus.PICKED_UP) updates.pickedUpAt = new Date();
    if (to === DeliveryStatus.DELIVERED) updates.deliveredAt = new Date();
    if (to === DeliveryStatus.CANCELLED) updates.cancelledAt = new Date();

    const [updated] = await prisma.$transaction([
      prisma.delivery.update({ where: { id: deliveryId }, data: updates }),
      prisma.deliveryTimeline.create({
        data: {
          deliveryId,
          status: to,
          description: meta?.description,
          latitude: meta?.latitude,
          longitude: meta?.longitude,
          actorId,
          actorType: actorType ?? 'system',
        },
      }),
    ]);

    return updated;
  }
}
