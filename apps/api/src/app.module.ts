import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { GeofencingModule } from './modules/geofencing/geofencing.module';
import { HealthModule } from './modules/health/health.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { RidersModule } from './modules/riders/riders.module';
import { SupportModule } from './modules/support/support.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL', 60) * 1000,
          limit: config.get('THROTTLE_LIMIT', 100),
        },
      ],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('REDIS_URL', 'redis://localhost:6379'),
      }),
    }),

    HealthModule,
    AuthModule,
    UsersModule,
    RidersModule,
    DeliveriesModule,
    PricingModule,
    DispatchModule,
    PaymentsModule,
    WalletsModule,
    TrackingModule,
    NotificationsModule,
    SupportModule,
    MerchantsModule,
    AdminModule,
    AnalyticsModule,
    GeofencingModule,
  ],
})
export class AppModule {}
