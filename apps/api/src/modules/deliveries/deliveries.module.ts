import { Module } from '@nestjs/common';

import { DispatchModule } from '../dispatch/dispatch.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PricingModule } from '../pricing/pricing.module';
import { TrackingModule } from '../tracking/tracking.module';
import { WalletsModule } from '../wallets/wallets.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesStateMachineService } from './deliveries-state-machine.service';

@Module({
  imports: [PricingModule, DispatchModule, WalletsModule, TrackingModule, NotificationsModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, DeliveriesStateMachineService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
