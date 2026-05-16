import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue')
  async getRevenue(@Query('days') days = 30) {
    return { data: await this.analyticsService.getRevenueByDay(+days) };
  }

  @Get('success-rate')
  async getSuccessRate() {
    return { data: await this.analyticsService.getDeliverySuccessRate() };
  }
}
