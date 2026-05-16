import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('session')
  async createSession(@Body() body: { supabaseId: string; email?: string; phone?: string }) {
    const user = await this.authService.getOrCreateUser(
      body.supabaseId,
      body.email,
      body.phone,
    );
    return { data: { userId: user.id, isNew: !user.updatedAt } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncUser(
    @CurrentUser() jwt: JwtPayload,
    @Body() body: { deviceId?: string; platform?: string; pushToken?: string },
  ) {
    const user = await this.authService.getOrCreateUser(jwt.supabaseId, jwt.email, jwt.phone);

    if (body.deviceId && body.platform) {
      await this.authService.updateLastSeen(
        user.id,
        body.deviceId,
        body.platform,
        body.pushToken,
      );
    }

    return { data: { userId: user.id } };
  }
}
