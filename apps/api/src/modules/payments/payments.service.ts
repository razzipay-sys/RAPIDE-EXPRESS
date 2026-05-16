import { Injectable } from '@nestjs/common';
import { prisma } from '@rapide/database';
import { TransactionType, WalletType } from '@rapide/types';
import { randomUUID } from 'crypto';

import { WalletsService } from '../wallets/wallets.service';
import { FlutterwaveService } from './flutterwave.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly flutterwave: FlutterwaveService,
  ) {}

  async initiateTopUp(userId: string, amount: number, email: string, phone: string) {
    const reference = `TOPUP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const link = await this.flutterwave.initializePayment({
      amount,
      currency: 'XOF',
      email,
      phone,
      reference,
      redirectUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/app/wallet?ref=${reference}`,
      meta: { userId, type: 'wallet_topup' },
    });
    return { paymentLink: link, reference };
  }

  async handleFlutterwaveWebhook(body: Record<string, unknown>, signature: string) {
    // Verify signature
    const isValid = this.flutterwave.verifyWebhookSignature(JSON.stringify(body), signature);
    if (!isValid) return false;

    const event = body['event'] as string;
    const data = body['data'] as Record<string, unknown>;

    if (event === 'charge.completed' && data['status'] === 'successful') {
      const meta = data['meta'] as Record<string, unknown>;
      if (meta?.['type'] === 'wallet_topup' && meta?.['userId']) {
        await this.walletsService.credit(
          meta['userId'] as string,
          WalletType.USER,
          Number(data['amount']),
          TransactionType.WALLET_TOPUP,
          'Wallet top-up via Flutterwave',
          data['tx_ref'] as string,
        );
      }
    }

    return true;
  }
}
