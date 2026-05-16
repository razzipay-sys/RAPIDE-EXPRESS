import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RidersService } from './riders.service';

@ApiTags('riders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'riders', version: '1' })
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.ridersService.findById(id) };
  }

  @Patch(':id/status')
  async setStatus(@Param('id') id: string, @Body() body: { status: 'online' | 'offline' | 'busy' }) {
    return { data: await this.ridersService.setOnlineStatus(id, body.status) };
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return { data: await this.ridersService.getStats(id) };
  }
}
