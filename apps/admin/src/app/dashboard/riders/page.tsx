'use client';

import { useState } from 'react';

const MOCK_RIDERS = Array.from({ length: 15 }, (_, i) => ({
  id: `rider-${i}`,
  name: ['Amavi Dossou', 'Félix Agbossou', 'Romuald Kpodji', 'Éric Hounsou', 'Cédric Gbaguidi'][i % 5],
  status: ['ACTIVE', 'PENDING_REVIEW', 'SUSPENDED'][i % 3 === 2 ? 2 : i % 2],
  onlineStatus: ['online', 'offline', 'busy'][i % 3],
  vehicle: ['MOTORCYCLE', 'BICYCLE', 'CAR'][i % 3],
  rating: (4.2 + (i % 8) * 0.1).toFixed(1),
  deliveries: 50 + i * 12,
  joinedAt: new Date(Date.now() - i * 30 * 24 * 3600 * 1000).toISOString(),
  kycStatus: ['APPROVED', 'PENDING', 'REJECTED'][i % 3],
}));

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'text-green-400 bg-green-400/10',
  PENDING_REVIEW: 'text-yellow-400 bg-yellow-400/10',
  SUSPENDED: 'text-red-400 bg-red-400/10',
  BANNED: 'text-red-600 bg-red-600/10',
};

const ONLINE_DOT: Record<string, string> = {
  online: 'bg-green-400',
  offline: 'bg-white/20',
  busy: 'bg-yellow-400',
};

const VEHICLE_LABEL: Record<string, string> = {
  MOTORCYCLE: '🏍️ Moto',
  BICYCLE: '🚲 Vélo',
  CAR: '🚗 Voiture',
};

const KYC_COLORS: Record<string, string> = {
  APPROVED: 'text-green-400',
  PENDING: 'text-yellow-400',
  REJECTED: 'text-red-400',
};

export default function RidersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const filtered = MOCK_RIDERS.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Tous' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-white text-2xl">Coursiers</h1>
        <div className="flex gap-2">
          <span className="px-3 py-2 rounded-xl bg-green-400/10 text-green-400 text-sm">
            {MOCK_RIDERS.filter((r) => r.onlineStatus === 'online').length} en ligne
          </span>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un coursier..."
          className="flex-1 h-10 bg-dark-surface border border-white/10 rounded-xl px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-rapide-orange transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 bg-dark-surface border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none"
        >
          {['Tous', 'ACTIVE', 'PENDING_REVIEW', 'SUSPENDED'].map((s) => (
            <option key={s} value={s}>{s === 'Tous' ? 'Tous' : s}</option>
          ))}
        </select>
      </div>

      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Coursier', 'Statut', 'En ligne', 'Véhicule', 'Note', 'Livraisons', 'KYC'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] cursor-pointer`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-rapide-orange-muted border border-rapide-orange/20 flex items-center justify-center text-xs">
                        {r.name.charAt(0)}
                      </div>
                      <span className="text-sm text-white">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[r.status] ?? 'text-white/40 bg-white/5'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${ONLINE_DOT[r.onlineStatus]}`} />
                  </td>
                  <td className="px-4 py-3 text-xs text-white/60">{VEHICLE_LABEL[r.vehicle] ?? r.vehicle}</td>
                  <td className="px-4 py-3 text-sm text-rapide-orange font-medium">★ {r.rating}</td>
                  <td className="px-4 py-3 text-sm text-white">{r.deliveries}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${KYC_COLORS[r.kycStatus] ?? 'text-white/40'}`}>{r.kycStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
