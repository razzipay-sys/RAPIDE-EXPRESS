'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WEEK_DATA = [
  { day: 'Lun', orders: 24, revenue: 48000 },
  { day: 'Mar', orders: 18, revenue: 36000 },
  { day: 'Mer', orders: 32, revenue: 64000 },
  { day: 'Jeu', orders: 28, revenue: 56000 },
  { day: 'Ven', orders: 45, revenue: 90000 },
  { day: 'Sam', orders: 52, revenue: 104000 },
  { day: 'Dim', orders: 38, revenue: 76000 },
];

const KPI = [
  { label: 'Commandes aujourd\'hui', value: '38', icon: '📦' },
  { label: 'Revenu semaine', value: '474 000 XOF', icon: '💰' },
  { label: 'Taux succès', value: '97.4%', icon: '✅' },
  { label: 'Délai moyen', value: '28 min', icon: '⏱️' },
];

export default function MerchantDashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-display font-bold text-white text-2xl">Tableau de bord</h1>
        <p className="text-white/40 text-sm">Bienvenue, voici l&apos;aperçu de votre activité</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {KPI.map((k) => (
          <div key={k.label} className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
            <span className="text-2xl block mb-3">{k.icon}</span>
            <p className="font-display font-bold text-white text-xl mb-1">{k.value}</p>
            <p className="text-white/40 text-xs">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-white mb-4">Commandes & Revenu — 7 derniers jours</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={WEEK_DATA}>
            <defs>
              <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1A1A26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
            />
            <Area type="monotone" dataKey="orders" stroke="#FF6B00" strokeWidth={2} fill="url(#ordersGrad)" name="Commandes" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-3">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Créer une commande', href: '/dashboard/orders/new', icon: '+ 📦' },
              { label: 'Envoi en masse (CSV)', href: '/dashboard/dispatch', icon: '📤' },
              { label: 'Voir les API keys', href: '/dashboard/api-keys', icon: '🔑' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-rapide-orange/30 hover:bg-rapide-orange/5 transition-all text-sm text-white/70 hover:text-white"
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-3">Commandes récentes</h3>
          <div className="space-y-2">
            {['RPD-20260516-0001', 'RPD-20260516-0002', 'RPD-20260516-0003'].map((ref) => (
              <div key={ref} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                <span className="font-mono text-xs text-white/70">{ref}</span>
                <span className="text-xs text-rapide-orange">En cours</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
