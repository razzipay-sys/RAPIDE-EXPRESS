import type { TransactionType, WalletType } from '../enums/payment';

export interface Wallet {
  id: string;
  ownerId: string;
  ownerType: WalletType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  deliveryId: string | null;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  description: string | null;
  reference: string | null;
  externalRef: string | null;
  providerName: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface Payout {
  id: string;
  walletId: string;
  amount: number;
  method: string;
  accountRef: string;
  status: string;
  processedAt: Date | null;
  failReason: string | null;
  externalRef: string | null;
  createdAt: Date;
}
