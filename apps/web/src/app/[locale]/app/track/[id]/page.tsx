'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDelivery } from '@/hooks/useDelivery';
import { useRiderTracking } from '@/hooks/useRiderTracking';
import { formatXOF } from '@rapide/utils';

const STATUS_STEPS = [
  'PENDING',
  'ASSIGNED',
  'RIDER_EN_ROUTE_PICKUP',
  'AT_PICKUP',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
];

const STATUS_FR: Record<string, string> = {
  PENDING: 'En attente d\'un coursier',
  ASSIGNED: 'Coursier assigné',
  RIDER_EN_ROUTE_PICKUP: 'Coursier en route',
  AT_PICKUP: 'Coursier à la collecte',
  PICKED_UP: 'Colis collecté',
  IN_TRANSIT: 'En transit',
  AT_DROPOFF: 'Arrivé à destination',
  DELIVERED: 'Livré !',
  FAILED: 'Échec de livraison',
  CANCELLED: 'Annulé',
};

const STATUS_ICON: Record<string, string> = {
  PENDING: '⏳',
  ASSIGNED: '✅',
  RIDER_EN_ROUTE_PICKUP: '🏍️',
  AT_PICKUP: '📍',
  PICKED_UP: '📦',
  IN_TRANSIT: '🚀',
  AT_DROPOFF: '🏁',
  DELIVERED: '🎉',
  FAILED: '❌',
  CANCELLED: '🚫',
};

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const { delivery, fetchDelivery, isLoading } = useDelivery();
  const { smoothPosition } = useRiderTracking({ deliveryId: id, enabled: !!delivery?.rider });
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<unknown>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    fetchDelivery(id);
    const interval = setInterval(() => fetchDelivery(id), 15000);
    return () => clearInterval(interval);
  }, [id, fetchDelivery]);

  useEffect(() => {
    if (!mapRef.current || !delivery) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    import('mapbox-gl').then((mapboxgl) => {
      const Mapbox = mapboxgl.default;
      Mapbox.accessToken = token;

      const map = new Mapbox.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [Number(delivery.rider ? 2.3158 : 2.3158), 6.3654],
        zoom: 13,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        // Pickup marker
        new Mapbox.Marker({ color: '#FF6B00' })
          .setLngLat([2.3158, 6.3654])
          .addTo(map);

        // Dropoff marker
        new Mapbox.Marker({ color: '#FFFFFF' })
          .setLngLat([2.3200, 6.3700])
          .addTo(map);

        // Rider marker (placeholder)
        const el = document.createElement('div');
        el.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-rapide-orange shadow-rapide border-2 border-white text-sm';
        el.innerText = '🏍️';

        markerRef.current = new Mapbox.Marker(el)
          .setLngLat([2.3158, 6.3654])
          .addTo(map);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery?.id]);

  useEffect(() => {
    if (!smoothPosition || !markerRef.current) return;
    (markerRef.current as { setLngLat: (lngLat: [number, number]) => void }).setLngLat([
      smoothPosition.lng,
      smoothPosition.lat,
    ]);
  }, [smoothPosition]);

  if (isLoading && !delivery) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-rapide-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-4xl">📦</p>
        <p className="text-white/50 text-sm">Livraison introuvable</p>
        <Link href="/app/history" className="text-rapide-orange text-sm hover:underline">← Retour</Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(delivery.status);
  const isActive = !['DELIVERED', 'FAILED', 'CANCELLED'].includes(delivery.status);

  return (
    <div className="flex flex-col min-h-full">
      {/* Map */}
      <div className="relative h-72 bg-dark-surface-2">
        <div ref={mapRef} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark pointer-events-none" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link href="/app/history" className="h-9 w-9 rounded-full bg-dark/70 backdrop-blur flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Status indicator */}
        {isActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 bg-dark/70 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rapide-orange opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rapide-orange" />
              </span>
              <p className="text-xs text-white font-medium">En direct</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-4 pb-6 space-y-4">
        {/* Status card */}
        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{STATUS_ICON[delivery.status] ?? '📦'}</span>
            <div>
              <p className="text-white font-semibold">{STATUS_FR[delivery.status] ?? delivery.status}</p>
              <p className="text-white/40 text-xs">{delivery.trackingCode}</p>
            </div>
          </div>

          {/* Progress bar */}
          {currentStepIndex >= 0 && (
            <div className="flex gap-1 mb-1">
              {STATUS_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i <= currentStepIndex ? 'bg-rapide-orange' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rider card */}
        {delivery.rider && (
          <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-rapide-orange-muted border border-rapide-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{delivery.rider.user.fullName}</p>
                <div className="flex items-center gap-1">
                  <span className="text-rapide-orange text-xs">{'★'.repeat(Math.round(delivery.rider.rating))}</span>
                  <span className="text-white/40 text-xs">{delivery.rider.rating}</span>
                </div>
              </div>
              <a href="tel:+" className="h-10 w-10 rounded-full bg-rapide-orange-muted border border-rapide-orange/20 flex items-center justify-center">
                <svg className="h-4 w-4 text-rapide-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Route */}
        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="h-3 w-3 rounded-full bg-rapide-orange" />
              <div className="flex-1 w-px bg-white/10 min-h-[24px]" />
              <div className="h-3 w-3 rounded-full border-2 border-white/40" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-white/40 text-xs">Collecte</p>
                <p className="text-white text-sm font-medium leading-tight">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Livraison</p>
                <p className="text-white text-sm font-medium leading-tight">{delivery.dropoffAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {delivery.timeline && delivery.timeline.length > 0 && (
          <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4">
            <h3 className="font-semibold text-white text-sm mb-3">Historique</h3>
            <div className="space-y-3">
              {delivery.timeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mt-1 ${i === 0 ? 'bg-rapide-orange' : 'bg-white/20'}`} />
                    {i < delivery.timeline.length - 1 && <div className="flex-1 w-px bg-white/10 mt-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-white text-xs font-medium">{STATUS_FR[event.status] ?? event.status}</p>
                    {event.description && <p className="text-white/40 text-xs">{event.description}</p>}
                    <p className="text-white/30 text-xs mt-0.5">
                      {new Date(event.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between">
          <span className="text-white/50 text-sm">Total facturé</span>
          <span className="font-bold text-white">{formatXOF(delivery.totalFare)}</span>
        </div>
      </div>
    </div>
  );
}
