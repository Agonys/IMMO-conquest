'use client';

import { Settings } from 'lucide-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GuildsCard, PlayersCard, SummaryCard } from '@/components/Cards';
import { ClientOnly } from '@/components/ClientOnly';
import { Container } from '@/components/Container';
import { Search } from '@/components/Search';
import { Tabs } from '@/components/Tabs';

const tabs = ['Guilds', 'Players', 'Summary'];
const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-foreground flex min-h-screen flex-col">
        <header className="bg-card border-b">
          <Container className="mx-auto">
            <h1 className="text-yellow-light text-3xl font-bold uppercase">Conquest</h1>
            <Settings className="absolute right-4" />
          </Container>
        </header>

        <main className="flex-1">
          <Container className="flex-col gap-8 py-8 pt-10">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-3xl font-bold">Conquest Leaderboard</h2>
              <p className="text-foreground-darker">Track the top performing guilds and players in conquest battles</p>
            </div>
            <Search />
          </Container>
          <Container>
            <ClientOnly>
              <Tabs tabs={tabs}>
                <GuildsCard id="guilds" />
                <PlayersCard id="players" />
                <SummaryCard id="summary" />
              </Tabs>
            </ClientOnly>
          </Container>
        </main>
      </div>
    </QueryClientProvider>
  );
}
