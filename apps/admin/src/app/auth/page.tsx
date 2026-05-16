'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="h-9 w-9 rounded-xl bg-rapide-gradient flex items-center justify-center">
            <span className="font-bold text-white">R</span>
          </div>
          <span className="font-display font-bold text-xl text-white">Rapide Admin</span>
        </div>

        <div className="bg-dark-surface border border-white/[0.08] rounded-3xl p-8">
          <h1 className="font-display font-bold text-white text-xl mb-1">Connexion</h1>
          <p className="text-white/40 text-sm mb-6">Accès réservé au personnel Rapide</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email administrateur"
                required
                list="admin-emails"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
              />
              <datalist id="admin-emails">
                <option value="razzipay@gmail.com" />
                <option value="adegbesanadebola1@gmail.com" />
              </datalist>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              required
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange transition-colors text-sm"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
