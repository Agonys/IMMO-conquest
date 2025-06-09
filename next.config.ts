import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    clientInstrumentationHook: true,
  },
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
