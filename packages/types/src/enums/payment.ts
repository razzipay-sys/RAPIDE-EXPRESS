export enum WalletType {
  USER = 'USER',
  RIDER = 'RIDER',
  MERCHANT = 'MERCHANT',
}

export enum TransactionType {
  DELIVERY_PAYMENT = 'DELIVERY_PAYMENT',
  WALLET_TOPUP = 'WALLET_TOPUP',
  RIDER_EARNING = 'RIDER_EARNING',
  PLATFORM_FEE = 'PLATFORM_FEE',
  PAYOUT = 'PAYOUT',
  REFUND = 'REFUND',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
  PROMO_CREDIT = 'PROMO_CREDIT',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PayoutMethod {
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
}

export const CURRENCY = 'XOF' as const;
export const MIN_TOPUP_AMOUNT = 500;
export const MIN_PAYOUT_AMOUNT = 1000;
export const PLATFORM_FEE_RATE = 0.2; // 20% platform commission
