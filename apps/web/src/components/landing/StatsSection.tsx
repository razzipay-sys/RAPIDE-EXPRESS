'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const STATS = [
  { value: 2000, suffix: '+', label: 'Clients actifs' },
  { value: 28, suffix: ' min', label: 'Délai moyen de livraison' },
  { value: 99, suffix: '%', label: 'Taux de satisfaction' },
  { value: 50, suffix: '+', label: 'Coursiers vérifiés' },
];

function AnimatedNumber({ to, suffix, trigger }: { to: number; suffix: string; trigger: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const start = Date.now();
    const duration = 1400;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [trigger, to]);

  return (
    <span>
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20 relative">
      {/* Divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-border-strong), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-border-strong), transparent)' }} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-none gradient-text tabular-nums">
                <AnimatedNumber to={stat.value} suffix={stat.suffix} trigger={inView} />
              </p>
              <p className="mt-2.5 text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
