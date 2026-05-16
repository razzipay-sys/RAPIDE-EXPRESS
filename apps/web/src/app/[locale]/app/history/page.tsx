'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDelivery } from '@/hooks/useDelivery';
import { formatXOF } from '@rapide/utils';

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'text-green-400 bg-green-400/10 border-green-400/20',
  FAILED: 'text-red-400 bg-red-400/10 border-red-400/20',
  CANCELLED: 'text-white/40 bg-white/5 border-white/10',
  IN_TRANSIT: 'text-rapide-orange bg-rapide-orange-muted border-rapide-orange/20',
  PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  ASSIGNED: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

const STATUS_FR: Record<string, string> = {
  PENDING: 'En attente',
  ASSIGNED: 'Assigné',
  RIDER_EN_ROUTE_PICKUP: 'En route',
  AT_PICKUP: 'À la collecte',
  PICKED_UP: 'Collecté',
  IN_TRANSIT: 'En transit',
  AT_DROPOFF: 'À destination',
  DELIVERED: 'Livré',
  FAILED: 'Échoué',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
};

const FILTERS = ['Tous', 'Actif', 'Livré', 'Annulé'] as const;
type Filter = (typeof FILTERS)[number];

export default function HistoryPage() {
  const { deliveries, fetchMyDeliveries, isLoading } = useDelivery();
  const [filter, setFilter] = useState<Filter>('Tous');

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  const filtered = deliveries.filter((d) => {
    if (filter === 'Actif') return !['DELIVERED', 'FAILED', 'CANCELLED', 'REFUNDED'].includes(d.status);
    if (filter === 'Livré') return d.status === 'DELIVERED';
    if (filter === 'Annulé') return ['FAILED', 'CANCELLED'].includes(d.status);
    return true;
  });

  return (
    <div className="min-h-full px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-white text-xl">Mes livraisons</h1>
        <Link href="/app/send" className="text-rapide-orange text-sm font-medium">
          + Nouveau
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-rapide-orange text-white'
                : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-5xl">📋</p>
          <p className="text-white/50 text-sm text-center">
            {filter === 'Tous'
              ? 'Aucune livraison pour l\'instant'
              : `Aucune livraison "${filter.toLowerCase()}"`}
          </p>
          {filter === 'Tous' && (
            <Link href="/app/send" className="text-rapide-orange text-sm hover:underline">
              Créer ma première livraison →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => {
            const statusColor = STATUS_COLORS[d.status] ?? 'text-white/50 bg-white/5 border-white/10';
            const isActive = !['DELIVERED', 'FAILED', 'CANCELLED', 'REFUNDED'].includes(d.status);

            return (
              <Link key={d.id} href={`/app/track/${d.id}`}>
                <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="relative flex h-2 w-2 flex-shrink-0 mt-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rapide-orange opacity-60" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rapide-orange" />
                        </span>
                      )}
                      <span className="text-white font-mono text-sm font-medium">{d.trackingCode}</span>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${statusColor}`}>
                      {STATUS_FR[d.status] ?? d.status}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <div className="flex flex-col items-center gap-0.5 pt-1">
                      <div className="h-2 w-2 rounded-full bg-rapide-orange" />
                      <div className="h-4 w-px bg-white/10" />
                      <div className="h-2 w-2 rounded-full border border-white/30" />
                    </div>
                    <div className="space-y-2.5 flex-1 min-w-0">
                      <p className="text-white/70 text-xs truncate">{d.pickupAddress}</p>
                      <p className="text-white/70 text-xs truncate">{d.dropoffAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-xs">
                      {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="font-semibold text-white text-sm">{formatXOF(d.totalFare)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
