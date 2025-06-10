import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['pino', 'pino-pretty'],
  images: {
    remotePatterns: [new URL('https://cdn.idle-mmo.com/**')],
  },
};

export default nextConfig;
