import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: { default: 'Rapide — Livraison express', template: '%s | Rapide' },
  description: 'La livraison express la plus rapide au Bénin.',
  keywords: ['livraison', 'Bénin', 'Cotonou', 'express', 'coursier'],
  openGraph: {
    type: 'website',
    siteName: 'Rapide',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  themeColor: '#FF6B00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans bg-dark text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
