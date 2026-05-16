import { Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';

@Injectable()
export class AdminService {
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalDeliveries, todayDeliveries, activeRiders, pendingKyc, openTickets] =
      await Promise.all([
        prisma.delivery.count(),
        prisma.delivery.count({ where: { createdAt: { gte: today } } }),
        prisma.rider.count({ where: { status: 'ACTIVE', onlineStatus: 'online' } }),
        prisma.riderDocument.count({ where: { status: 'PENDING' } }),
        prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      ]);

    return { totalDeliveries, todayDeliveries, activeRiders, pendingKyc, openTickets };
  }

  async getLiveDeliveries() {
    return prisma.delivery.findMany({
      where: { status: { in: ['ASSIGNED', 'RIDER_EN_ROUTE_PICKUP', 'AT_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'AT_DROPOFF'] } },
      include: { rider: true, customer: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async logAction(adminId: string, action: string, resourceType: string, resourceId: string, before?: object, after?: object) {
    return prisma.auditLog.create({
      data: { adminId, action, resourceType, resourceId, before, after },
    });
  }
}
