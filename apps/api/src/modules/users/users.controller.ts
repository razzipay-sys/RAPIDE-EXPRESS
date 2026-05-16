import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: JwtPayload) {
    const data = await this.usersService.findBySupabaseId(user.supabaseId);
    return { data };
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() body: { fullName?: string; avatarUrl?: string; language?: string },
  ) {
    const userData = await this.usersService.findBySupabaseId(user.supabaseId);
    if (!userData) return { data: null };
    const updated = await this.usersService.updateProfile(userData.id, body);
    return { data: updated };
  }

  @Get('me/addresses')
  async getAddresses(@CurrentUser() user: JwtPayload) {
    const userData = await this.usersService.findBySupabaseId(user.supabaseId);
    if (!userData) return { data: [] };
    const addresses = await this.usersService.getAddresses(userData.id);
    return { data: addresses };
  }

  @Post('me/addresses')
  async addAddress(
    @CurrentUser() user: JwtPayload,
    @Body() body: { label: string; fullAddress: string; latitude: number; longitude: number; isDefault?: boolean },
  ) {
    const userData = await this.usersService.findBySupabaseId(user.supabaseId);
    if (!userData) return { data: null };
    const address = await this.usersService.addAddress(userData.id, body);
    return { data: address };
  }
}
