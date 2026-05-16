'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  const { user, session, isLoading, setSession, setLoading, signOut: storeSignOut } = useAuthStore();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    storeSignOut();
  }, [supabase, storeSignOut]);

  return { user, session, isLoading, isAuthenticated: !!user, signOut };
}
