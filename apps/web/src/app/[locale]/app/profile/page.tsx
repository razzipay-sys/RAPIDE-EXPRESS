'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const MENU_ITEMS = [
  { label: 'Mes adresses', href: '/app/profile/addresses', icon: '📍' },
  { label: 'Notifications', href: '/app/profile/notifications', icon: '🔔' },
  { label: 'Langue', href: '/app/profile/language', icon: '🌍' },
  { label: 'Parrainage', href: '/app/profile/referral', icon: '🎁' },
  { label: 'Aide & Support', href: '/support', icon: '🎧' },
  { label: 'Conditions d\'utilisation', href: '/terms', icon: '📄' },
  { label: 'Politique de confidentialité', href: '/privacy', icon: '🔒' },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const displayName = user?.user_metadata?.full_name ?? user?.phone ?? 'Utilisateur';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-full px-4 pt-6 pb-4">
      <h1 className="font-display font-bold text-white text-xl mb-6">Profil</h1>

      {/* User card */}
      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-rapide-gradient flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-xl text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-white text-lg truncate">{displayName}</p>
          <p className="text-white/40 text-sm truncate">{user?.phone ?? user?.email ?? '—'}</p>
        </div>
        <Link href="/app/profile/edit" className="flex-shrink-0 h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
      </div>

      {/* Menu */}
      <div className="bg-dark-surface border border-white/[0.06] rounded-2xl overflow-hidden mb-4">
        {MENU_ITEMS.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors ${
              i < MENU_ITEMS.length - 1 ? 'border-b border-white/[0.06]' : ''
            }`}
          >
            <span className="text-lg w-6 text-center">{item.icon}</span>
            <span className="flex-1 text-white text-sm">{item.label}</span>
            <svg className="h-4 w-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Version */}
      <p className="text-center text-white/20 text-xs mb-4">Version 1.0.0 · Rapide</p>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-all"
      >
        Se déconnecter
      </button>
    </div>
  );
}
