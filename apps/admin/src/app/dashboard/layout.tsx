'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/dashboard/map', label: 'Flotte', icon: '🗺️' },
  { href: '/dashboard/deliveries', label: 'Livraisons', icon: '📦' },
  { href: '/dashboard/riders', label: 'Coursiers', icon: '🏍️' },
  { href: '/dashboard/customers', label: 'Clients', icon: '👥' },
  { href: '/dashboard/merchants', label: 'Marchands', icon: '🏪' },
  { href: '/dashboard/finance', label: 'Finance', icon: '💰' },
  { href: '/dashboard/support', label: 'Support', icon: '🎧' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-dark-surface border-r border-white/[0.06] flex flex-col">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-rapide-gradient flex items-center justify-center">
              <span className="font-bold text-white text-sm">R</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Rapide</p>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto hide-scrollbar">
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/dashboard';
            const isActiveDashboard = item.exact && pathname === '/dashboard';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive || isActiveDashboard
                    ? 'bg-rapide-orange-muted border border-rapide-orange/20 text-rapide-orange'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <span>🚪</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-rapide-dark">
        {children}
      </main>
    </div>
  );
}
