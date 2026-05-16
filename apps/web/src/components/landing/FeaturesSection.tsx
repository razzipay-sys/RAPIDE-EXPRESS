'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Suivi en temps réel',
    description: 'Regardez votre coursier se déplacer sur la carte, minute par minute. Notifications à chaque étape.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Livraison en 30 min',
    description: 'Notre réseau couvre tout Cotonou. En moyenne 28 minutes de la collecte à la livraison.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Paiement sécurisé',
    description: 'Mobile Money, cartes bancaires, portefeuille Rapide. Toutes les transactions sont chiffrées.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Multi-colis',
    description: 'Plusieurs arrêts, un seul ordre. Optimisez vos envois avec notre fonctionnalité multi-destination.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Coursiers vérifiés',
    description: 'Vérification d\'identité complète, antécédents et formation avant chaque admission sur la plateforme.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Support 24/7',
    description: 'Notre équipe répond en moins de 2 minutes. Chat en direct, WhatsApp, ou appel direct.',
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" ref={ref} className="py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium mb-4"
            style={{ color: '#FF6B00' }}
          >
            Pourquoi Rapide ?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-[var(--color-text)] leading-tight"
          >
            Tout ce dont vous avez besoin,{' '}
            <span className="gradient-text">en une seule app</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'var(--color-border)' }}>
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              className="group p-8 transition-colors duration-200"
              style={{ background: 'var(--color-bg)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-surface)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)'; }}
            >
              {/* Icon */}
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-200 group-hover:scale-110"
                style={{
                  background: 'rgba(255,107,0,0.10)',
                  color: '#FF6B00',
                  border: '1px solid rgba(255,107,0,0.18)',
                }}
              >
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="font-display font-semibold text-base text-[var(--color-text)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
