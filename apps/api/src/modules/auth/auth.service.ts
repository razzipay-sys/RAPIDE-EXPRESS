import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { prisma } from '@rapide/database';
import { generateReferralCode } from '@rapide/utils';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.getOrThrow('NEXT_PUBLIC_SUPABASE_URL'),
      config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async getOrCreateUser(supabaseId: string, email?: string, phone?: string) {
    let user = await prisma.user.findUnique({ where: { supabaseId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId,
          email,
          phone,
          referralCode: generateReferralCode(),
          profile: { create: {} },
          wallet: {
            create: {
              ownerType: 'USER',
              currency: 'XOF',
            },
          },
        },
        include: { profile: true, wallet: true },
      });
    }

    return user;
  }

  async updateLastSeen(userId: string, deviceId: string, platform: string, pushToken?: string) {
    await prisma.userDevice.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      update: { lastSeenAt: new Date(), pushToken, isActive: true },
      create: { userId, deviceId, platform, pushToken, isActive: true },
    });
  }

  async validateSupabaseUser(supabaseId: string) {
    const { data, error } = await this.supabase.auth.admin.getUserById(supabaseId);
    if (error || !data.user) throw new UnauthorizedException('User not found in Supabase');
    return data.user;
  }
}
