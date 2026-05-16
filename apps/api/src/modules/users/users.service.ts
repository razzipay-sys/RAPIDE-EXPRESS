import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@rapide/database';

@Injectable()
export class UsersService {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true, wallet: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findBySupabaseId(supabaseId: string) {
    return prisma.user.findUnique({
      where: { supabaseId },
      include: { profile: true },
    });
  }

  async updateProfile(id: string, data: { fullName?: string; avatarUrl?: string; language?: string }) {
    return prisma.user.update({ where: { id }, data });
  }

  async getAddresses(userId: string) {
    return prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async addAddress(userId: string, data: {
    label: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
    isDefault?: boolean;
  }) {
    if (data.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return prisma.userAddress.create({ data: { userId, ...data } });
  }
}
