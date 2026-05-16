import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SupportService } from './support.service';

@ApiTags('support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'support', version: '1' })
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async createTicket(
    @CurrentUser() user: JwtPayload,
    @Body() body: { subject: string; category: string; deliveryId?: string },
  ) {
    return { data: await this.supportService.createTicket(user.sub, body) };
  }

  @Get('tickets')
  async getTickets(@CurrentUser() user: JwtPayload) {
    return { data: await this.supportService.getTickets(user.sub) };
  }

  @Post('tickets/:id/messages')
  async addMessage(
    @CurrentUser() user: JwtPayload,
    @Param('id') ticketId: string,
    @Body() body: { content: string },
  ) {
    return { data: await this.supportService.addMessage(ticketId, user.sub, 'customer', body.content) };
  }
}
