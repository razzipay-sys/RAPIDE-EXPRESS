import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@rapide/database';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPush(userId: string, title: string, body: string, data?: Record<string, unknown>) {
    const devices = await prisma.userDevice.findMany({
      where: { userId, isActive: true, pushToken: { not: null } },
    });

    for (const device of devices) {
      this.logger.debug(`Sending push to ${device.pushToken}: ${title}`);
      // TODO: integrate firebase-admin FCM send
    }

    await this.createInApp(userId, title, body, data);
  }

  async createInApp(userId: string, title: string, body: string, data?: Record<string, unknown>) {
    return prisma.notification.create({
      data: {
        userId,
        type: 'system',
        title,
        body,
        data,
      },
    });
  }

  async markRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnread(userId: string) {
    return prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
