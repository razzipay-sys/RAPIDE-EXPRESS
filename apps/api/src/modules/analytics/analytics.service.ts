import { Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';

@Injectable()
export class AnalyticsService {
  async getRevenueByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return prisma.$queryRaw`
      SELECT
        DATE(created_at) AS date,
        COUNT(*)::int AS deliveries,
        SUM(total_fare)::int AS revenue
      FROM deliveries
      WHERE status = 'DELIVERED'
        AND created_at >= ${since}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
  }

  async getDeliverySuccessRate() {
    const [delivered, failed, total] = await Promise.all([
      prisma.delivery.count({ where: { status: 'DELIVERED' } }),
      prisma.delivery.count({ where: { status: 'FAILED' } }),
      prisma.delivery.count({ where: { status: { in: ['DELIVERED', 'FAILED', 'CANCELLED'] } } }),
    ]);
    return { delivered, failed, total, successRate: total > 0 ? delivered / total : 0 };
  }
}
