import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rapide/ui', '@rapide/utils', '@rapide/types'],
  images: {
    domains: ['*.supabase.co'],
  },
};

export default nextConfig;
