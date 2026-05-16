import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rapide/utils', '@rapide/types'],
};

export default nextConfig;
