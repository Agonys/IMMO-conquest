import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const pageDomain = process.env.NEXT_PUBLIC_PAGE_DOMAIN || 'https://idlemmo-conquest.com';

export const viewport: Viewport = {
  themeColor: '#fcc800',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'IdleMMO Conquest',
  description:
    'IdleMMO guilds conquest leaderboard: see which guilds are fighting for dominance against other players in epic battles!',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: './favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: './favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: './apple-touch-icon.png',
    },
  ],
  openGraph: {
    title: 'IdleMMO Conquest',
    description:
      'IdleMMO guilds conquest leaderboard: Stay updated on guild standings, player performance, and who’s ruling each terrain!',
    url: pageDomain,
    siteName: 'IdleMMO Conquest',
    type: 'website',
    images: [
      {
        url: `${pageDomain}/og-image-new.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>

      {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
    </html>
  );
}
