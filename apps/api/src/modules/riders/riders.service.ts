import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@rapide/database';
import { RiderStatus } from '@rapide/types';

@Injectable()
export class RidersService {
  async findById(id: string) {
    const rider = await prisma.rider.findUnique({
      where: { id },
      include: { stats: true, documents: true },
    });
    if (!rider) throw new NotFoundException('Rider not found');
    return rider;
  }

  async setOnlineStatus(riderId: string, status: 'online' | 'offline' | 'busy') {
    return prisma.rider.update({
      where: { id: riderId },
      data: { onlineStatus: status },
    });
  }

  async updateKycStatus(documentId: string, status: string, reviewedBy: string, rejectReason?: string) {
    return prisma.riderDocument.update({
      where: { id: documentId },
      data: { status: status as any, reviewedBy, reviewedAt: new Date(), rejectReason },
    });
  }

  async getStats(riderId: string) {
    return prisma.riderStats.findUnique({ where: { riderId } });
  }

  async list(page = 1, limit = 20, status?: RiderStatus) {
    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      prisma.rider.findMany({ where, skip: (page - 1) * limit, take: limit, include: { stats: true } }),
      prisma.rider.count({ where }),
    ]);
    return { items, total, page, limit };
  }
}
