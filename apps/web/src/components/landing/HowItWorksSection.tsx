'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Saisissez les adresses',
    description: 'Entrez le point de collecte et la destination. La carte interactive vous guide pour une adresse exacte.',
  },
  {
    number: '02',
    title: 'Configurez votre colis',
    description: 'Catégorie, poids, mode express ou programmé, assurance optionnelle. 30 secondes chrono.',
  },
  {
    number: '03',
    title: 'Payez en un clic',
    description: 'Mobile Money, carte bancaire ou portefeuille Rapide. Paiement instantané et sécurisé.',
  },
  {
    number: '04',
    title: 'Suivez en direct',
    description: 'Votre coursier se déplace sur la carte. Notifié à chaque étape jusqu\'à la livraison.',
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how" ref={ref} className="py-32 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--color-bg-surface)' }} />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium mb-4"
            style={{ color: '#FF6B00' }}
          >
            Comment ça marche ?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-[var(--color-text)] leading-tight"
          >
            Livrez en{' '}
            <span className="gradient-text">4 étapes simples</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, var(--color-border-strong) 20%, var(--color-border-strong) 80%, transparent)' }} />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Number circle */}
              <div className="relative z-10 mb-5">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm"
                  style={{
                    background: i === 0 ? '#FF6B00' : 'var(--color-bg-elevated)',
                    color: i === 0 ? '#fff' : '#FF6B00',
                    border: i === 0 ? 'none' : '1px solid rgba(255,107,0,0.25)',
                    boxShadow: i === 0 ? '0 0 24px rgba(255,107,0,0.35)' : 'none',
                  }}
                >
                  {step.number}
                </div>
              </div>

              <h3 className="font-display font-semibold text-base text-[var(--color-text)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-[var(--color-text-secondary)]">
            Première livraison en{' '}
            <strong className="text-[var(--color-text)]">moins de 3 minutes</strong>
            {' '}après votre inscription.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
