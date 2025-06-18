import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IdleMMO Conquest',
  description: 'Leaderboard of players and guilds throughout various seasons of conquest in IdleMMO',
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
