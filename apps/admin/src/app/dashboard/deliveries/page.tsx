'use client';

import { useState } from 'react';

const STATUS_OPTIONS = ['Tous', 'PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED'];

const MOCK_DELIVERIES = Array.from({ length: 20 }, (_, i) => ({
  id: `RPD-20260516-${String(i + 1).padStart(4, '0')}`,
  status: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'][i % 5],
  customer: ['Kofi Mensah', 'Adaeze Okafor', 'Yaw Darko', 'Fatou Diallo', 'Seun Balogun'][i % 5],
  pickup: ['Plateau, Cotonou', 'Fidjrossè, Cotonou', 'Ganhi, Cotonou', 'Cadjèhoun, Cotonou'][i % 4],
  dropoff: ['Akpakpa, Cotonou', 'Missèbo, Cotonou', 'Vedoko, Cotonou', 'Fidjrossè, Cotonou'][i % 4],
  fare: [1500, 2000, 2500, 3000, 3500, 4000][i % 6],
  createdAt: new Date(Date.now() - i * 12 * 60 * 1000).toISOString(),
}));

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  ASSIGNED: 'text-blue-400 bg-blue-400/10',
  IN_TRANSIT: 'text-rapide-orange bg-rapide-orange-muted',
  DELIVERED: 'text-green-400 bg-green-400/10',
  FAILED: 'text-red-400 bg-red-400/10',
  CANCELLED: 'text-white/40 bg-white/5',
};

const STATUS_FR: Record<string, string> = {
  PENDING: 'En attente',
  ASSIGNED: 'Assigné',
  IN_TRANSIT: 'En transit',
  DELIVERED: 'Livré',
  FAILED: 'Échoué',
  CANCELLED: 'Annulé',
};

export default function DeliveriesPage() {
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [search, setSearch] = useState('');

  const filtered = MOCK_DELIVERIES.filter((d) => {
    const matchStatus = statusFilter === 'Tous' || d.status === statusFilter;
    const matchSearch = !search || d.id.includes(search.toUpperCase()) || d.customer.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-white text-2xl">Livraisons</h1>
        <button className="px-4 py-2 rounded-xl bg-rapide-gradient text-white text-sm font-medium shadow-rapide">
          + Créer manuellement
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par référence, client..."
          className="flex-1 h-10 bg-dark-surface border border-white/10 rounded-xl px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-rapide-orange transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 bg-dark-surface border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none focus:border-rapide-orange transition-colors"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'Tous' ? 'Tous les statuts' : (STATUS_FR[s] ?? s)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Référence', 'Statut', 'Client', 'Collecte', 'Livraison', 'Tarif', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className={`${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] cursor-pointer`}>
                  <td className="px-4 py-3 font-mono text-xs text-white/80">{d.id}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[d.status] ?? 'text-white/50 bg-white/5'}`}>
                      {STATUS_FR[d.status] ?? d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/80">{d.customer}</td>
                  <td className="px-4 py-3 text-xs text-white/50 max-w-[140px] truncate">{d.pickup}</td>
                  <td className="px-4 py-3 text-xs text-white/50 max-w-[140px] truncate">{d.dropoff}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{d.fare.toLocaleString('fr-FR')} XOF</td>
                  <td className="px-4 py-3 text-xs text-white/40">
                    {new Date(d.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/[0.06] text-xs text-white/40">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
