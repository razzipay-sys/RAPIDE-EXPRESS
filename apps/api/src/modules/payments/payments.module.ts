import { Module } from '@nestjs/common';
import { WalletsModule } from '../wallets/wallets.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { FlutterwaveService } from './flutterwave.service';

@Module({
  imports: [WalletsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, FlutterwaveService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
