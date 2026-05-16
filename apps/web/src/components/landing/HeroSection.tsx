'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const WORDS = ['La livraison', 'la plus', 'rapide', 'au Bénin.'];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-[var(--color-bg)]" />

      {/* Radial orange glow — centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 65%)' }} />

      {/* Top edge glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.4)] to-transparent" />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%)',
        }} />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">

        {/* Launch badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 mb-10"
        >
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(255,107,0,0.10)',
              border: '1px solid rgba(255,107,0,0.22)',
              color: '#FF6B00',
            }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B00]" />
            </span>
            Disponible à Cotonou
          </span>
        </motion.div>

        {/* Main headline */}
        <h1 className="font-display font-bold leading-[1.08] tracking-tight mb-8">
          {WORDS.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`block ${
                i === 2
                  ? 'gradient-text text-[clamp(4rem,10vw,8rem)]'
                  : 'text-[clamp(2.8rem,7vw,5.5rem)] text-[var(--color-text)]'
              }`}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46, duration: 0.6 }}
          className="text-[clamp(1rem,2.5vw,1.25rem)] text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed mb-12"
        >
          Envoyez n&apos;importe quoi dans Cotonou en moins de 30 minutes.
          Suivi en temps réel, paiement mobile, coursiers vérifiés.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link
            href="/auth"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-white transition-all duration-200"
            style={{
              background: '#FF6B00',
              boxShadow: '0 0 0 0 rgba(255,107,0,0)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(255,107,0,0.40)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(255,107,0,0)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            Envoyer un colis
            <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="#how"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            style={{ border: '1px solid var(--color-border-strong)' }}
          >
            Comment ça marche
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {['#FF6B00', '#FF8C3A', '#E55A00', '#FF6B00'].map((c, i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-[var(--color-bg)]" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }} />
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-text)] font-semibold">2 000+</strong> clients
            </span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#FF6B00] text-sm leading-none">★</span>
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-text)] font-semibold">4.9</strong>/5
            </span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">
            Livraison en <strong className="text-[var(--color-text)] font-semibold">28 min</strong> en moyenne
          </span>
        </motion.div>

        {/* Phone mockup + floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 mx-auto max-w-[320px]"
        >
          {/* Phone frame */}
          <div className="relative rounded-[2.5rem] overflow-hidden"
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-strong)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
              aspectRatio: '9/19',
            }}>

            {/* Phone notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full"
              style={{ background: 'var(--color-bg-overlay)' }} />

            {/* Status bar */}
            <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-6">
              <span className="text-[10px] font-semibold text-[var(--color-text-tertiary)]">9:41</span>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-4 rounded-full" style={{ background: 'var(--color-text-tertiary)' }} />
                <div className="h-1.5 w-2.5 rounded-full" style={{ background: 'var(--color-text-tertiary)' }} />
              </div>
            </div>

            {/* App header */}
            <div className="absolute top-12 left-0 right-0 px-5">
              <p className="text-[10px] text-[var(--color-text-tertiary)]">Bonjour, Kofi 👋</p>
              <p className="text-sm font-bold text-[var(--color-text)]">Où livrer aujourd&apos;hui ?</p>
            </div>

            {/* Map area */}
            <div className="absolute top-24 left-0 right-0 bottom-0 rounded-t-3xl overflow-hidden"
              style={{ background: 'var(--color-bg-elevated)' }}>
              {/* Fake grid */}
              <div className="absolute inset-0 opacity-30">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b" style={{ borderColor: 'var(--color-border)', height: '48px' }} />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 border-r" style={{ borderColor: 'var(--color-border)', left: `${(i + 1) * 16.66}%` }} />
                ))}
              </div>

              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 300" fill="none">
                <path d="M60 240 C60 180, 160 160, 180 80" stroke="#FF6B00" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
              </svg>

              {/* Rider */}
              <div className="absolute" style={{ left: '42%', top: '45%' }}>
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm border-2 border-[var(--color-bg)]"
                  style={{ background: '#FF6B00', boxShadow: '0 0 20px rgba(255,107,0,0.5)' }}>
                  🏍️
                </div>
                <div className="absolute -inset-2 rounded-full animate-ping opacity-20"
                  style={{ background: '#FF6B00' }} />
              </div>

              {/* Destination */}
              <div className="absolute" style={{ left: '50%', top: '20%' }}>
                <div className="h-5 w-5 rounded-full border-2 bg-[var(--color-bg)] border-[var(--color-text)]" />
              </div>

              {/* ETA card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-3"
                style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'rgba(255,107,0,0.12)' }}>
                      👤
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--color-text)]">Amavi D.</p>
                      <div className="flex gap-px">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: '#FF6B00', fontSize: '8px' }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">Arrivée</p>
                    <p className="text-sm font-bold" style={{ color: '#FF6B00' }}>12 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat card — left */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-16 top-16 rounded-2xl p-3 w-36"
            style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
          >
            <p className="text-[10px] text-[var(--color-text-tertiary)] mb-0.5">Livraisons / jour</p>
            <p className="text-xl font-display font-bold" style={{ color: '#FF6B00' }}>284</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-green-400">↑ 12%</span>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">vs hier</span>
            </div>
          </motion.div>

          {/* Floating notification — right */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute -right-14 bottom-24 rounded-2xl p-3 w-40"
            style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-5 rounded-full flex items-center justify-center text-[9px]"
                style={{ background: 'rgba(34,197,94,0.15)' }}>
                ✓
              </div>
              <span className="text-[10px] font-semibold text-[var(--color-text)]">Livré !</span>
            </div>
            <p className="text-[10px] text-[var(--color-text-tertiary)] font-mono">RPD-0516-4F2A</p>
            <p className="text-[10px] text-green-400 mt-1">● Livré avec succès</p>
          </motion.div>

          {/* Bottom glow under phone */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full blur-2xl pointer-events-none"
            style={{ background: 'rgba(255,107,0,0.15)' }} />
        </motion.div>
      </div>
    </section>
  );
}
