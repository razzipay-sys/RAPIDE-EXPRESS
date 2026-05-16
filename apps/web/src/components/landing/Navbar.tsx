'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Comment ça marche', href: '#how' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Pour les pros', href: '#pro' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled
              ? 'glass shadow-[0_8px_32px_rgba(0,0,0,0.32)]'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)] group-hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] transition-shadow">
              <span className="text-white font-display font-bold text-sm tracking-tight">R</span>
            </div>
            <span className="font-display font-bold text-lg text-[var(--color-text)] tracking-tight">Rapide</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-border)] transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl bg-[#FF6B00] text-white text-sm font-semibold hover:bg-[#E55A00] transition-colors shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_28px_rgba(255,107,0,0.45)]"
            >
              Commencer
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden ml-1 p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-all"
              aria-label="Menu"
            >
              <div className="w-5 space-y-1.5">
                <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass rounded-2xl p-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-xl hover:bg-[var(--color-border)] transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-[var(--color-border)] mt-2 pt-2">
              <Link
                href="/auth"
                className="block px-4 py-3 text-sm font-semibold text-[#FF6B00] rounded-xl hover:bg-[var(--color-orange-muted)] transition-all"
              >
                Connexion / S&apos;inscrire →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
