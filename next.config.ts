import type { NextConfig } from 'next';
import { withAxiom } from 'next-axiom';

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ['pino', 'pino-pretty'],
  images: {
    remotePatterns: [new URL('https://idlemmo-conquest.com/**')],
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
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https://www.googletagmanager.com https://www.google-analytics.com https://*.cloudflareinsights.com/;",
              "img-src 'self' data: https:;",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;",
              "style-src 'self' 'unsafe-inline';",
              'frame-src https://www.googletagmanager.com;',
              "object-src 'none';",
              "base-uri 'self';",
              "frame-ancestors 'none';",
            ].join(' '),
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withAxiom(nextConfig);
