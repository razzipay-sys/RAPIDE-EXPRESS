import { Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class MerchantsService {
  async findByOwner(ownerId: string) {
    return prisma.merchant.findFirst({ where: { ownerId }, include: { members: true } });
  }

  async generateApiKey(merchantId: string, name: string, permissions: string[]) {
    const raw = randomBytes(32).toString('hex');
    const prefix = raw.slice(0, 8);
    const keyHash = createHash('sha256').update(raw).digest('hex');
    await prisma.merchantApiKey.create({ data: { merchantId, name, keyHash, prefix, permissions } });
    return { key: `rp_${raw}`, prefix };
  }

  async getDeliveries(merchantId: string, page = 1, limit = 20) {
    return prisma.delivery.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
