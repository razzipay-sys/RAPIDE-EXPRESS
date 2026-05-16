'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  {
    href: '/app/home',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    label: 'Accueil',
  },
  {
    href: '/app/send',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    label: 'Envoyer',
  },
  {
    href: '/app/history',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Historique',
  },
  {
    href: '/app/wallet',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6" />
      </svg>
    ),
    label: 'Portefeuille',
  },
  {
    href: '/app/profile',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    label: 'Profil',
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-rapide-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-dark flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 pb-20 overflow-auto hide-scrollbar">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-dark-surface border-t border-white/[0.06] px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-rapide-orange' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {item.icon(isActive)}
                <span className="text-[10px] font-medium">{item.label}</span>
                {item.href === '/app/send' && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rapide-orange animate-ping" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
