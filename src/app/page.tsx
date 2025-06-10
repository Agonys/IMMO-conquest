'use client';

import { Settings } from 'lucide-react';
import { Search } from '@/components/Search';

export default function Home() {
  return (
    <div className="text-foreground flex min-h-screen flex-col">
      <header className="bg-card border-b">
        <div className="relative container mx-auto flex items-center justify-center px-4 py-4">
          <h1 className="text-yellow-light text-3xl font-bold uppercase">Conquest</h1>
          <Settings className="absolute right-0" />
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center gap-8 px-4 py-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-3xl font-bold">Conquest Leaderboard</h2>
            <p className="text-foreground-darker">Track the top performing guilds and players in conquest battles</p>
          </div>
          <Search />
        </section>
      </main>
    </div>
  );
}
