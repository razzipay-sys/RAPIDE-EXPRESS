import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MerchantsService } from './merchants.service';

@ApiTags('merchants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'merchants', version: '1' })
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('me')
  async getMerchant(@CurrentUser() user: JwtPayload) {
    return { data: await this.merchantsService.findByOwner(user.sub) };
  }
}
