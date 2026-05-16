'use client';

import { useState } from 'react';

const MOCK_ZONES = [
  { id: '1', name: 'Cotonou Centre', slug: 'cotonou-centre', baseFare: 500, perKmRate: 150, minFare: 500, isActive: true },
  { id: '2', name: 'Porto-Novo', slug: 'porto-novo', baseFare: 600, perKmRate: 175, minFare: 600, isActive: true },
  { id: '3', name: 'Parakou', slug: 'parakou', baseFare: 700, perKmRate: 200, minFare: 700, isActive: false },
];

export default function PricingSettingsPage() {
  const [zones] = useState(MOCK_ZONES);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-white text-2xl">Zones tarifaires</h1>
        <button className="px-4 py-2 rounded-xl bg-rapide-gradient text-white text-sm font-medium">
          + Nouvelle zone
        </button>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{zone.name}</h3>
                <p className="text-white/40 text-xs font-mono">{zone.slug}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${zone.isActive ? 'text-green-400 bg-green-400/10' : 'text-white/40 bg-white/5'}`}>
                {zone.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white/40 text-xs mb-1">Tarif de base</p>
                <p className="text-white font-medium">{zone.baseFare.toLocaleString('fr-FR')} XOF</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Tarif / km</p>
                <p className="text-white font-medium">{zone.perKmRate.toLocaleString('fr-FR')} XOF</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Tarif minimum</p>
                <p className="text-white font-medium">{zone.minFare.toLocaleString('fr-FR')} XOF</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-all">
                Modifier
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-all">
                Règles de tarif
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-all">
                Surge actuel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
