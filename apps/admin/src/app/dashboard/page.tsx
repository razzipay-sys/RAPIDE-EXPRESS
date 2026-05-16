'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_REVENUE = [
  { hour: '00h', revenue: 45000 },
  { hour: '02h', revenue: 12000 },
  { hour: '04h', revenue: 8000 },
  { hour: '06h', revenue: 32000 },
  { hour: '08h', revenue: 120000 },
  { hour: '10h', revenue: 185000 },
  { hour: '12h', revenue: 220000 },
  { hour: '14h', revenue: 195000 },
  { hour: '16h', revenue: 240000 },
  { hour: '18h', revenue: 310000 },
  { hour: '20h', revenue: 275000 },
  { hour: '22h', revenue: 180000 },
];

const MOCK_KPI = [
  { label: 'Livraisons aujourd\'hui', value: '284', change: '+12%', trend: 'up', icon: '📦' },
  { label: 'Revenu du jour', value: '2,145,000 XOF', change: '+8%', trend: 'up', icon: '💰' },
  { label: 'Coursiers actifs', value: '47', change: '-3', trend: 'down', icon: '🏍️' },
  { label: 'Taux de réussite', value: '98.2%', change: '+0.4%', trend: 'up', icon: '✅' },
];

const MOCK_ORDERS = [
  { id: 'RPD-20260516-A1B2', status: 'IN_TRANSIT', customer: 'Kofi Mensah', rider: 'Amavi Dossou', fare: 2500, time: '5 min' },
  { id: 'RPD-20260516-C3D4', status: 'PENDING', customer: 'Adaeze Okafor', rider: '—', fare: 1800, time: '2 min' },
  { id: 'RPD-20260516-E5F6', status: 'ASSIGNED', customer: 'Yaw Darko', rider: 'Félix Agbossou', fare: 3200, time: '12 min' },
  { id: 'RPD-20260516-G7H8', status: 'DELIVERED', customer: 'Fatou Diallo', rider: 'Romuald Kpodji', fare: 1500, time: '—' },
  { id: 'RPD-20260516-I9J0', status: 'RIDER_EN_ROUTE_PICKUP', customer: 'Seun Balogun', rider: 'Éric Hounsou', fare: 4100, time: '8 min' },
];

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  ASSIGNED: 'text-blue-400 bg-blue-400/10',
  RIDER_EN_ROUTE_PICKUP: 'text-blue-300 bg-blue-300/10',
  IN_TRANSIT: 'text-rapide-orange bg-rapide-orange-muted',
  DELIVERED: 'text-green-400 bg-green-400/10',
  FAILED: 'text-red-400 bg-red-400/10',
};

const STATUS_FR: Record<string, string> = {
  PENDING: 'En attente',
  ASSIGNED: 'Assigné',
  RIDER_EN_ROUTE_PICKUP: 'En route',
  IN_TRANSIT: 'En transit',
  DELIVERED: 'Livré',
  FAILED: 'Échoué',
};

function KpiCard({ label, value, change, trend, icon }: { label: string; value: string; change: string; trend: 'up' | 'down'; icon: string }) {
  return (
    <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {change}
        </span>
      </div>
      <p className="font-display font-bold text-white text-xl mb-1">{value}</p>
      <p className="text-white/40 text-xs">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Operations</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {time.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}
            <span className="font-mono">{time.toLocaleTimeString('fr-FR')}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-400 text-sm font-medium">Système opérationnel</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {MOCK_KPI.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Revenue chart + live orders */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Revenu — Aujourd&apos;hui</h2>
            <span className="text-white/40 text-xs">XOF</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_REVENUE}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1A1A26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
                formatter={(v: number) => [`${v.toLocaleString('fr-FR')} XOF`, 'Revenu']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Répartition statuts</h2>
          <div className="space-y-3">
            {[
              { label: 'En transit', count: 38, color: 'bg-rapide-orange', pct: 75 },
              { label: 'En attente', count: 12, color: 'bg-yellow-400', pct: 24 },
              { label: 'Assigné', count: 8, color: 'bg-blue-400', pct: 16 },
              { label: 'Livré', count: 226, color: 'bg-green-400', pct: 100 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{item.label}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live orders table */}
      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Livraisons en cours</h2>
          <a href="/dashboard/deliveries" className="text-rapide-orange text-xs hover:underline">Voir tout →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Référence', 'Statut', 'Client', 'Coursier', 'Tarif', 'ETA'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order, i) => (
                <tr key={order.id} className={`${i < MOCK_ORDERS.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <td className="px-5 py-3.5 font-mono text-xs text-white/80">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_BADGE[order.status] ?? 'text-white/50 bg-white/5'}`}>
                      {STATUS_FR[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/80">{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-white/60">{order.rider}</td>
                  <td className="px-5 py-3.5 text-sm text-white font-medium">{order.fare.toLocaleString('fr-FR')} XOF</td>
                  <td className="px-5 py-3.5 text-sm">
                    {order.time === '—' ? (
                      <span className="text-white/30">—</span>
                    ) : (
                      <span className="text-rapide-orange font-medium">{order.time}</span>
                    )}
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
