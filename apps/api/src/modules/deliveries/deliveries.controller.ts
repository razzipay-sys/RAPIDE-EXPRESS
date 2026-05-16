import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { DeliveryStatus } from '@rapide/types';

import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@ApiTags('deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'deliveries', version: '1' })
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDeliveryDto) {
    const delivery = await this.deliveriesService.create(user.sub, dto);
    return { data: delivery };
  }

  @Get('my')
  async myDeliveries(
    @CurrentUser() user: JwtPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.deliveriesService.findByCustomer(user.sub, +page, +limit);
    return { data: result.items, meta: { page: result.page, total: result.total, totalPages: result.totalPages } };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const delivery = await this.deliveriesService.findOne(id);
    return { data: delivery };
  }

  @Public()
  @Get('track/:code')
  async trackByCode(@Param('code') code: string) {
    const delivery = await this.deliveriesService.findByTrackingCode(code);
    return { data: delivery };
  }
}
