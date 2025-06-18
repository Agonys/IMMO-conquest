import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['pino', 'pino-pretty'],
  images: {
    remotePatterns: [new URL('https://idlemmo-conquest.com/**')],
  },
  allowedDevOrigins: ['192.168.0.87'],
};

export default nextConfig;
