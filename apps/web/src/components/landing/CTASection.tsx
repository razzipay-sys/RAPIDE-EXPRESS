'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const TRUST = [
  { label: 'Inscription gratuite' },
  { label: 'Paiement sécurisé' },
  { label: 'Suivi en temps réel' },
  { label: 'Support 24/7' },
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">

      {/* Orange radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,107,0,0.12) 0%, transparent 70%)' }}
      />

      {/* Top edge line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.35), transparent)' }} />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-sm font-medium mb-5"
          style={{ color: '#FF6B00' }}
        >
          Rejoignez des milliers de clients
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="font-display font-bold text-[clamp(2.2rem,5vw,3.5rem)] text-[var(--color-text)] leading-[1.1] mb-6"
        >
          Prêt à expédier{' '}
          <span className="gradient-text">en toute confiance</span> ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.16, duration: 0.5 }}
          className="text-[var(--color-text-secondary)] text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Créez votre compte gratuitement et effectuez votre première livraison en moins de 3 minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link
            href="/auth"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-200"
            style={{ background: '#FF6B00', boxShadow: '0 0 0 0 rgba(255,107,0,0)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 40px rgba(255,107,0,0.45)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(255,107,0,0)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Créer un compte gratuit
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="#how"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            style={{ border: '1px solid var(--color-border-strong)' }}
          >
            En savoir plus
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {TRUST.map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <svg className="h-4 w-4 flex-shrink-0" style={{ color: '#22c55e' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
