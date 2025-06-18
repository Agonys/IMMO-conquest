import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['pino', 'pino-pretty'],
  images: {
    remotePatterns: [new URL('https://idlemmo-conquest.com/**')],
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.0.87'],
  async headers() {
    return [
      {
        source: '/uploaded/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=21600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
