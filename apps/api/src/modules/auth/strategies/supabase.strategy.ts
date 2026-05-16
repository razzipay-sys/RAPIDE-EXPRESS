import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { createClient } from '@supabase/supabase-js';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('SUPABASE_JWT_SECRET'),
    });
  }

  validate(payload: { sub: string; email?: string; phone?: string; role?: string }): JwtPayload {
    if (!payload.sub) throw new UnauthorizedException('Invalid token payload');
    return {
      sub: payload.sub,
      supabaseId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
  }
}
