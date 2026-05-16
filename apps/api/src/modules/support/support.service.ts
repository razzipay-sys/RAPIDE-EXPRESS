import { Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';

@Injectable()
export class SupportService {
  async createTicket(userId: string, data: { subject: string; category: string; deliveryId?: string }) {
    return prisma.supportTicket.create({
      data: { userId, ...data, status: 'OPEN', priority: 'MEDIUM' },
    });
  }

  async addMessage(ticketId: string, senderId: string, senderType: string, content: string) {
    return prisma.supportMessage.create({
      data: { ticketId, senderId, senderType, content },
    });
  }

  async getTickets(userId: string) {
    return prisma.supportTicket.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
