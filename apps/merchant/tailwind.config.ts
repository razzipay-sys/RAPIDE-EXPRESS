import type { Config } from 'tailwindcss';
import baseConfig from '@rapide/config/tailwind';

const config: Config = {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
