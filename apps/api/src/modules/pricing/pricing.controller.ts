import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { PriceEstimateDto } from './dto/price-estimate.dto';
import { PricingService } from './pricing.service';
import { PricingZoneService } from './pricing-zone.service';

@ApiTags('pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'pricing', version: '1' })
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly zoneService: PricingZoneService,
  ) {}

  @Public()
  @Post('estimate')
  async estimate(@Body() dto: PriceEstimateDto) {
    const estimate = await this.pricingService.estimatePrice(dto);
    return { data: estimate };
  }

  @Public()
  @Get('zones')
  async getZones() {
    const zones = await this.zoneService.getAllZones();
    return { data: zones };
  }
}
