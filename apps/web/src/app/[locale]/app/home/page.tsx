'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDelivery } from '@/hooks/useDelivery';
import { formatXOF } from '@rapide/utils';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { label: 'Envoyer un colis', href: '/app/send', icon: '📦', color: 'bg-rapide-orange-muted border-rapide-orange/20' },
  { label: 'Suivre ma livraison', href: '/app/history', icon: '📍', color: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Mon portefeuille', href: '/app/wallet', icon: '💳', color: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Aide & Support', href: '/support', icon: '🎧', color: 'bg-purple-500/10 border-purple-500/20' },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400',
  ASSIGNED: 'text-blue-400',
  RIDER_EN_ROUTE_PICKUP: 'text-blue-400',
  AT_PICKUP: 'text-blue-400',
  PICKED_UP: 'text-rapide-orange',
  IN_TRANSIT: 'text-rapide-orange',
  AT_DROPOFF: 'text-rapide-orange',
  DELIVERED: 'text-green-400',
  FAILED: 'text-red-400',
  CANCELLED: 'text-white/40',
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
};

export default function HomePage() {
  const { user } = useAuth();
  const { deliveries, fetchMyDeliveries, isLoading } = useDelivery();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  useEffect(() => {
    let map: unknown;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapRef.current) return;

    import('mapbox-gl').then((mapboxgl) => {
      const Mapbox = mapboxgl.default;
      Mapbox.accessToken = token;

      map = new Mapbox.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [2.3158, 6.3654], // Cotonou, Benin
        zoom: 12,
        interactive: false,
        attributionControl: false,
      });

      (map as { on: (event: string, cb: () => void) => void }).on('load', () => setMapLoaded(true));
    });

    return () => {
      if (map) (map as { remove: () => void }).remove();
    };
  }, []);

  const activeDeliveries = deliveries.filter((d) =>
    !['DELIVERED', 'FAILED', 'CANCELLED', 'REFUNDED'].includes(d.status),
  );
  const recentDeliveries = deliveries.slice(0, 3);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'là';

  return (
    <div className="flex flex-col h-full">
      {/* Map header */}
      <div className="relative h-64 bg-dark-surface-2 overflow-hidden">
        <div ref={mapRef} className="absolute inset-0" />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-dark-surface-2 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-rapide-orange border-t-transparent animate-spin" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark pointer-events-none" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs">Bonjour,</p>
            <p className="font-display font-bold text-white text-lg">{firstName} 👋</p>
          </div>
          <Link href="/app/profile" className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </Link>
        </div>

        {/* Active delivery badge */}
        {activeDeliveries.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <Link href={`/app/track/${activeDeliveries[0].id}`}>
              <div className="bg-dark-surface/90 backdrop-blur-sm border border-rapide-orange/30 rounded-2xl p-3 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rapide-orange opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rapide-orange" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-rapide-orange font-medium">Livraison active</p>
                  <p className="text-white text-sm font-medium truncate">{activeDeliveries[0].trackingCode}</p>
                </div>
                <svg className="h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 pb-4 space-y-6 overflow-auto hide-scrollbar">
        {/* Quick actions */}
        <section>
          <h2 className="font-display font-semibold text-white text-sm mb-3">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center gap-3 p-4 rounded-2xl border ${action.color} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-white text-sm font-medium leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent deliveries */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-white text-sm">Livraisons récentes</h2>
            <Link href="/app/history" className="text-rapide-orange text-xs hover:underline">Voir tout</Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recentDeliveries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-white/50 text-sm">Aucune livraison pour l&apos;instant</p>
              <Link href="/app/send" className="inline-block mt-3 text-rapide-orange text-sm hover:underline">
                Créer ma première livraison →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDeliveries.map((d) => (
                <Link key={d.id} href={`/app/track/${d.id}`}>
                  <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 hover:border-white/[0.12] transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-rapide-orange-muted border border-rapide-orange/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📦</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{d.trackingCode}</p>
                      <p className="text-white/40 text-xs truncate">{d.dropoffAddress}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-medium ${STATUS_COLORS[d.status] ?? 'text-white/50'}`}>
                        {STATUS_FR[d.status] ?? d.status}
                      </p>
                      <p className="text-white/40 text-xs">{formatXOF(d.totalFare)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
