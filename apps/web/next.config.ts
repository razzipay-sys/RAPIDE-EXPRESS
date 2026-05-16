import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@rapide/ui', '@rapide/utils', '@rapide/types', '@rapide/i18n'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  experimental: {
    optimizePackageImports: ['framer-motion', '@radix-ui/react-dialog'],
  },

  webpack: (config) => {
    config.externals = config.externals || [];
    return config;
  },
};

export default withNextIntl(nextConfig);
