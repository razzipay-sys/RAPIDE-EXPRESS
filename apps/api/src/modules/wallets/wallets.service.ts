import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from '@rapide/database';
import { TransactionType, WalletType } from '@rapide/types';

@Injectable()
export class WalletsService {
  async getWallet(ownerId: string, ownerType: WalletType) {
    const wallet = await prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId, ownerType } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getBalance(ownerId: string, ownerType: WalletType): Promise<number> {
    const wallet = await this.getWallet(ownerId, ownerType);
    return Number(wallet.balance);
  }

  /**
   * Atomic debit — uses SELECT FOR UPDATE to prevent race conditions.
   */
  async debit(
    ownerId: string,
    ownerType: WalletType,
    amount: number,
    type: TransactionType,
    description: string,
    reference?: string,
    deliveryId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.$queryRaw<{ id: string; balance: Prisma.Decimal }[]>`
        SELECT id, balance FROM wallets
        WHERE owner_id = ${ownerId}::uuid AND owner_type = ${ownerType}::"WalletType"
        FOR UPDATE
      `;

      if (!wallet[0]) throw new NotFoundException('Wallet not found');

      const currentBalance = Number(wallet[0].balance);
      if (currentBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const newBalance = currentBalance - amount;

      await tx.wallet.update({
        where: { id: wallet[0].id },
        data: { balance: newBalance },
      });

      return tx.transaction.create({
        data: {
          walletId: wallet[0].id,
          deliveryId,
          type,
          amount: -amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description,
          reference,
          status: 'completed',
        },
      });
    });
  }

  /**
   * Atomic credit.
   */
  async credit(
    ownerId: string,
    ownerType: WalletType,
    amount: number,
    type: TransactionType,
    description: string,
    reference?: string,
    deliveryId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.$queryRaw<{ id: string; balance: Prisma.Decimal }[]>`
        SELECT id, balance FROM wallets
        WHERE owner_id = ${ownerId}::uuid AND owner_type = ${ownerType}::"WalletType"
        FOR UPDATE
      `;

      if (!wallet[0]) throw new NotFoundException('Wallet not found');

      const currentBalance = Number(wallet[0].balance);
      const newBalance = currentBalance + amount;

      await tx.wallet.update({
        where: { id: wallet[0].id },
        data: { balance: newBalance },
      });

      return tx.transaction.create({
        data: {
          walletId: wallet[0].id,
          deliveryId,
          type,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description,
          reference,
          status: 'completed',
        },
      });
    });
  }

  async getTransactions(ownerId: string, ownerType: WalletType, page = 1, limit = 20) {
    const wallet = await this.getWallet(ownerId, ownerType);
    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where: { walletId: wallet.id } }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
