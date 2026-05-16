'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthStep = 'phone' | 'otp';

function OtpDigitInput({ value, onChange, onKeyDown, inputRef }: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: (el: HTMLInputElement | null) => void;
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
      onKeyDown={onKeyDown}
      className="h-14 w-12 rounded-2xl bg-white/5 border border-white/10 text-center text-xl font-bold text-white focus:outline-none focus:border-rapide-orange focus:bg-rapide-orange/5 transition-all duration-200"
    />
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs: (HTMLInputElement | null)[] = [];

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('229')) return `+${digits}`;
    if (digits.startsWith('0')) return `+229${digits.slice(1)}`;
    return `+229${digits}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      setError('Entrez un numéro valide');
      return;
    }
    setIsLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        phone: formatPhone(phone),
      });
      if (err) throw err;
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = digits.join('');
    if (code.length < 6) return;
    setError('');
    setIsLoading(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        phone: formatPhone(phone),
        token: code,
        type: 'sms',
      });
      if (err) throw err;
      router.push('/app/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Code incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!value) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (index < 5) inputRefs[index + 1]?.focus();
    if (index === 5 && next.every(Boolean)) {
      setDigits(next);
      setTimeout(handleVerifyOtp, 100);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rapide-orange/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-rapide-orange/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-xl bg-rapide-gradient flex items-center justify-center">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">Rapide</span>
        </Link>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-bold text-white mb-2">Bienvenue</h1>
                <p className="text-white/50 text-sm">Entrez votre numéro pour continuer</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-base">🇧🇯</span>
                    <span className="text-white/40 text-sm">+229</span>
                    <div className="h-4 w-px bg-white/10" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="XX XX XX XX"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-28 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rapide-orange focus:bg-rapide-orange/5 transition-all duration-200"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:scale-100"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : 'Recevoir le code'}
                </button>
              </form>

              <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs">ou</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <button
                  onClick={async () => {
                    await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo: `${window.location.origin}/app/home` },
                    });
                  }}
                  className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuer avec Google
                </button>
              </div>

              <p className="text-center text-white/30 text-xs mt-6">
                En continuant, vous acceptez nos{' '}
                <Link href="/terms" className="text-rapide-orange hover:underline">Conditions</Link>
                {' '}et{' '}
                <Link href="/privacy" className="text-rapide-orange hover:underline">Politique de confidentialité</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-bold text-white mb-2">Vérification</h1>
                <p className="text-white/50 text-sm">
                  Code envoyé au <span className="text-white">{formatPhone(phone)}</span>
                </p>
              </div>

              <div className="flex gap-3 justify-center mb-6">
                {digits.map((digit, i) => (
                  <OtpDigitInput
                    key={i}
                    value={digit}
                    onChange={(v) => handleDigitChange(i, v)}
                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                    inputRef={(el) => { inputRefs[i] = el; }}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || digits.some((d) => !d)}
                className="w-full h-14 rounded-2xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? 'Vérification...' : 'Confirmer'}
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => { setStep('phone'); setDigits(['', '', '', '', '', '']); setError(''); }}
                  className="text-white/40 text-sm hover:text-white/70 transition-colors"
                >
                  ← Changer de numéro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
