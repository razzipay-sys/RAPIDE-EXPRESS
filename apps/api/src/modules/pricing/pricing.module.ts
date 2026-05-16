import { Module } from '@nestjs/common';

import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PricingZoneService } from './pricing-zone.service';

@Module({
  controllers: [PricingController],
  providers: [PricingService, PricingZoneService],
  exports: [PricingService],
})
export class PricingModule {}
