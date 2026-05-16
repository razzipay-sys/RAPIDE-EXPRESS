import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlutterwaveService {
  private readonly logger = new Logger(FlutterwaveService.name);
  private readonly secretKey: string;

  constructor(private readonly config: ConfigService) {
    this.secretKey = config.get('FLUTTERWAVE_SECRET_KEY', '');
  }

  async initializePayment(data: {
    amount: number;
    currency: string;
    email: string;
    phone: string;
    reference: string;
    redirectUrl: string;
    meta?: Record<string, unknown>;
  }) {
    const payload = {
      tx_ref: data.reference,
      amount: data.amount,
      currency: data.currency,
      redirect_url: data.redirectUrl,
      customer: { email: data.email, phone_number: data.phone },
      customizations: { title: 'Rapide Delivery', logo: 'https://rapide.bj/logo.png' },
      meta: data.meta,
    };

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { status: string; data: { link: string } };
    return result.data.link;
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = this.config.get('FLUTTERWAVE_WEBHOOK_SECRET', '');
    const crypto = require('crypto') as typeof import('crypto');
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return hash === signature;
  }
}
