import type { Metadata } from 'next';

import { CTASection } from '@/components/landing/CTASection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { Navbar } from '@/components/landing/Navbar';
import { StatsSection } from '@/components/landing/StatsSection';

export const metadata: Metadata = {
  title: 'Rapide — Livraison express au Bénin',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-bg)' }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
