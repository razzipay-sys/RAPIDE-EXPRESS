'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';
import { formatXOF } from '@rapide/utils';

const TOPUP_AMOUNTS = [2000, 5000, 10000, 25000, 50000, 100000];

const TX_TYPE_LABELS: Record<string, string> = {
  DELIVERY_PAYMENT: 'Paiement livraison',
  WALLET_TOPUP: 'Rechargement',
  RIDER_EARNING: 'Gain coursier',
  PLATFORM_FEE: 'Frais plateforme',
  PAYOUT: 'Retrait',
  REFUND: 'Remboursement',
  REFERRAL_BONUS: 'Bonus parrainage',
  PROMO_CREDIT: 'Crédit promo',
};

const TX_ICON: Record<string, string> = {
  DELIVERY_PAYMENT: '📦',
  WALLET_TOPUP: '⬆️',
  PAYOUT: '⬇️',
  REFUND: '↩️',
  REFERRAL_BONUS: '🎁',
  PROMO_CREDIT: '🎟️',
};

export default function WalletPage() {
  const { wallet, transactions, isLoading, fetchWallet, fetchTransactions, initiateTopUp, error } = useWallet();
  const { user } = useAuth();
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState('');

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet, fetchTransactions]);

  const handleTopUp = async () => {
    const amount = selectedAmount ?? Number(customAmount);
    if (!amount || amount < 500) { setTopUpError('Montant minimum : 500 XOF'); return; }
    setTopUpError('');
    setIsTopUpLoading(true);
    try {
      const { paymentLink } = await initiateTopUp(
        amount,
        user?.email ?? '',
        user?.phone ?? '',
      );
      window.open(paymentLink, '_blank');
      setShowTopUp(false);
    } catch (err) {
      setTopUpError(err instanceof Error ? err.message : 'Erreur de rechargement');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  return (
    <div className="min-h-full px-4 pt-6 pb-4">
      <h1 className="font-display font-bold text-white text-xl mb-6">Portefeuille</h1>

      {/* Balance card */}
      <div className="relative bg-rapide-gradient rounded-3xl p-6 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-8" />
        <p className="text-white/70 text-sm mb-2 relative">Solde disponible</p>
        {isLoading ? (
          <div className="h-10 w-40 bg-white/20 rounded-xl animate-pulse" />
        ) : (
          <p className="font-display font-bold text-4xl text-white relative">
            {formatXOF(wallet?.balance ?? 0)}
          </p>
        )}
        <div className="mt-4 relative">
          <button
            onClick={() => setShowTopUp(true)}
            className="bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 rounded-xl text-white font-medium text-sm transition-all"
          >
            + Recharger
          </button>
        </div>
      </div>

      {/* Top-up sheet */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-surface border border-white/[0.08] rounded-t-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-white">Recharger</h2>
              <button onClick={() => setShowTopUp(false)} className="text-white/40 hover:text-white/70">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {TOPUP_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                  className={`h-12 rounded-xl text-sm font-medium border transition-all ${
                    selectedAmount === amount
                      ? 'border-rapide-orange bg-rapide-orange-muted text-rapide-orange'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  {formatXOF(amount)}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
              placeholder="Montant personnalisé (XOF)"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm mb-4"
            />

            {topUpError && <p className="text-red-400 text-xs mb-3">{topUpError}</p>}

            <button
              onClick={handleTopUp}
              disabled={isTopUpLoading || (!selectedAmount && !customAmount)}
              className="w-full h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide transition-all disabled:opacity-50"
            >
              {isTopUpLoading ? 'Traitement...' : `Recharger ${formatXOF(selectedAmount ?? Number(customAmount) || 0)}`}
            </button>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div>
        <h2 className="font-display font-semibold text-white text-sm mb-3">Transactions</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">💳</p>
            <p className="text-white/40 text-sm">Aucune transaction</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const isCredit = ['WALLET_TOPUP', 'REFUND', 'REFERRAL_BONUS', 'PROMO_CREDIT', 'RIDER_EARNING'].includes(tx.type);
              return (
                <div key={tx.id} className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <span>{TX_ICON[tx.type] ?? '💳'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{TX_TYPE_LABELS[tx.type] ?? tx.type}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <p className={`font-bold text-sm flex-shrink-0 ${isCredit ? 'text-green-400' : 'text-white'}`}>
                    {isCredit ? '+' : '-'}{formatXOF(Math.abs(tx.amount))}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
