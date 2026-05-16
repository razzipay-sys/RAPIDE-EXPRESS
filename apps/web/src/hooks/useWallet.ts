'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  description?: string;
  reference?: string;
  providerName?: string;
  status: string;
  createdAt: string;
}

interface Wallet {
  id: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Wallet }>('/wallets/me');
      setWallet(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<{ data: Transaction[] }>(`/wallets/me/transactions?page=${page}`);
      setTransactions(res.data);
    } catch {
      // silently fail — transactions are non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initiateTopUp = useCallback(async (amount: number, email: string, phone: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<{ data: { paymentLink: string; txRef: string } }>('/payments/topup', {
        amount,
        email,
        phone,
      });
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de rechargement';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { wallet, transactions, isLoading, error, fetchWallet, fetchTransactions, initiateTopUp };
}
