import { Body, Controller, Headers, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('topup')
  async initiateTopUp(
    @CurrentUser() user: JwtPayload,
    @Body() body: { amount: number; email: string; phone: string },
  ) {
    const result = await this.paymentsService.initiateTopUp(
      user.sub,
      body.amount,
      body.email,
      body.phone,
    );
    return { data: result };
  }

  @Public()
  @Post('webhook/flutterwave')
  async flutterwaveWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('verif-hash') signature: string,
    @Body() body: Record<string, unknown>,
  ) {
    await this.paymentsService.handleFlutterwaveWebhook(body, signature);
    return { status: 'ok' };
  }
}
