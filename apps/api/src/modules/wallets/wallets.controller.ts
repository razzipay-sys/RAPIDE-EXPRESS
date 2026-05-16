import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletType } from '@rapide/types';

import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'wallets', version: '1' })
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me')
  async getMyWallet(@CurrentUser() user: JwtPayload) {
    const wallet = await this.walletsService.getWallet(user.sub, WalletType.USER);
    return { data: wallet };
  }

  @Get('me/transactions')
  async getMyTransactions(
    @CurrentUser() user: JwtPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.walletsService.getTransactions(user.sub, WalletType.USER, +page, +limit);
    return {
      data: result.items,
      meta: { page: result.page, total: result.total, totalPages: result.totalPages },
    };
  }
}
