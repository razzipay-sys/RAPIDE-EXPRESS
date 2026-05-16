'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '📊', exact: true },
  { href: '/dashboard/orders', label: 'Commandes', icon: '📦' },
  { href: '/dashboard/dispatch', label: 'Envoi en masse', icon: '📤' },
  { href: '/dashboard/finance', label: 'Finance', icon: '💰' },
  { href: '/dashboard/team', label: 'Équipe', icon: '👥' },
  { href: '/dashboard/api-keys', label: 'Clés API', icon: '🔑' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙️' },
];

export default function MerchantDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      <aside className="w-56 flex-shrink-0 bg-dark-surface border-r border-white/[0.06] flex flex-col">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-rapide-gradient flex items-center justify-center">
              <span className="font-bold text-white text-sm">R</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Rapide</p>
              <p className="text-white/30 text-xs">Marchand</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-rapide-orange-muted border border-rapide-orange/20 text-rapide-orange'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
