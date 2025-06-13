'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/Badge';
import { LocationSelect } from '@/components/LocationSelect';
import { PaginationControls } from '@/components/PaginationControls';
import { Separator } from '@/components/Separator';
import { useGetGuilds, useMediaQuerySizes } from '@/hooks';
import { useGetLocations } from '@/hooks/query';
import { cn } from '@/utils';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface GuildsCardProps {
  id: string;
}

interface GuildEntry {
  position: number;
  guildName: string;
  guildIcon: string;
  totalExp: number;
  kills: number;
  killToExpRatio: number;
  participants: number;
  guildSize: number;
  bestPlayer: {
    name: string;
    totalLevel: number;
    avatar: string;
    background: string;
    kills: number;
    experience: number;
  };
}

const mockData = [
  {
    position: 1,
    guildName: 'Dream Team',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJWANY8M303VVRQBA25E8E.png',
    totalExp: 495781,
    kills: 179365,
    killToExpRatio: 2.76,
    participants: 19,
    guildSize: 25,
    bestPlayer: {
      name: 'DefiasBandit',
      totalLevel: 855,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01JRG6NJGPFS1MS7A187XQJ9RQ.png',
      background:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01JK5XWXFN8BMDZZKEFP3J5H46.jpg',
      kills: 26810,
      experience: 105312,
    },
  },
  {
    position: 2,
    guildName: 'France',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJWHWABR02S7SKBMFH45R0.png',
    totalExp: 145168,
    kills: 49015,
    killToExpRatio: 2.96,
    participants: 14,
    guildSize: 25,
    bestPlayer: {
      name: 'Sylrus',
      totalLevel: 1558,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/fdc0ekyIhrToEBwkGNSeuFOpCr0oYW-metaU3Zlcm5vbSAocmVwbGFjZSB0aGUgb2xkIG9uZSkucG5n-.png',
      background:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01JF7EF2B7W1ZSSV9W0A9CZKKP.jpg',
      kills: 4046,
      experience: 12138,
    },
  },
  {
    position: 3,
    guildName: 'RAWR',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJV939YW1AA7M76BW0BWN6.png',
    totalExp: 70812,
    kills: 26660,
    killToExpRatio: 2.66,
    participants: 18,
    guildSize: 25,
    bestPlayer: {
      name: 'RudiTabuti',
      totalLevel: 1500,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HP21WJNBFY28A3QPT9H0TAKR.png',
      background:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01J30ADWZTQ5W4W9K1DYKF7EW7.jpg',
      kills: 2672,
      experience: 13069,
    },
  },
  {
    position: 4,
    guildName: 'END',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJXXGRYKS0WXJVT3QNMY3D.png',
    totalExp: 31166,
    kills: 9332,
    killToExpRatio: 3.34,
    participants: 10,
    guildSize: 25,
    bestPlayer: {
      name: 'JohnGroham',
      totalLevel: 1732,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HT2CE4FZ9JHQ8DWKVC9YY1R1.png',
      background:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HXVG90BR3FWZWW9VFQ29NH0X.jpg',
      kills: 1331,
      experience: 6655,
    },
  },
  {
    position: 5,
    guildName: 'Stay Frosty',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQK4KJEJCR6H8DX9B8XZGFR.png',
    totalExp: 6458,
    kills: 3249,
    killToExpRatio: 1.99,
    participants: 7,
    guildSize: 25,
    bestPlayer: {
      name: 'Tennzor',
      totalLevel: 1522,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/7dWkSMBekaGH1FMaPvMUeJBmO6hLx8-metaQXN0YXJvdGgucG5n-.png',
      background:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/0u0ve05bgPPuH2omPfkQ5XtAmeHgDn-metaaGFsbG93ZWVuLnBuZw==-.png',
      kills: 1675,
      experience: 4485,
    },
  },
] satisfies GuildEntry[];

export const GuildsCard = ({ id }: GuildsCardProps) => {
  const { screenSizes } = useMediaQuerySizes();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    bestPlayer: screenSizes.xl,
    participants: screenSizes.sm,
    killToExpRatio: screenSizes.xl,
  });

  const { data: locations, isLoading: locationsIsLoading } = useGetLocations();
  const { data: guildsList, isLoading: guildsListIsLoading } = useGetGuilds({
    location: currentLocation,
  });

  const isContentLoaded = useMemo(
    () => !locationsIsLoading && !guildsListIsLoading,
    [locationsIsLoading, guildsListIsLoading],
  );

  const onSelectLocation = (locationKey: string | null) => {
    setCurrentLocation(locationKey);
  };

  const columns: ColumnDef<GuildEntry>[] = [
    {
      accessorKey: 'position',
      header: () => <div className="md:pl-2">#</div>,
      cell: ({ getValue, row }) => {
        const { position } = row.original;
        const isPodium = position <= 3;

        return isPodium ? (
          <Trophy strokeWidth={1.5} size={32} className={cn(getColorByPosition(position))} />
        ) : (
          <div
            className={cn(
              'flex aspect-square w-10 items-center justify-center rounded-full',
              getColorByPosition(position),
            )}
          >
            {getValue<number>()}
          </div>
        );
      },
    },
    {
      accessorKey: 'guildName',
      header: () => <div>Guild</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {
            <Image
              src={row.original.guildIcon}
              alt={row.original.guildName}
              height={48}
              width={48}
              className={cn('aspect-square w-8 rounded', 'sm:w-10', 'md:w-12', 'lg:w-14')}
            />
          }
          <span>{row.original.guildName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalExp',
      header: () => <div>EXP</div>,
      cell: ({ getValue }) => <div>{getValue<number>().toLocaleString()}</div>,
    },
    {
      accessorKey: 'kills',
      header: () => <div>Kills</div>,
      cell: ({ getValue }) => <div>{getValue<number>().toLocaleString()}</div>,
    },
    {
      accessorKey: 'killToExpRatio',
      header: () => <div>Ratio</div>,
    },
    {
      accessorKey: 'participants',
      header: () => <div>Participants</div>,
      cell: ({ getValue, row }) => (
        <div>
          {getValue<number>()}/{row.original.guildSize}
        </div>
      ),
    },
    {
      accessorKey: 'bestPlayer',
      accessorFn: (row) => row.bestPlayer.name,
      header: () => <div>Best Player</div>,
      cell: ({ row }) => {
        const player = row.original.bestPlayer;
        return (
          <div className="flex items-center gap-4">
            <div
              className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-full border opacity-80"
              style={{ backgroundImage: `url(${player.background})` }}
            >
              <Image
                src={player.avatar}
                alt={player.name}
                fill
                sizes="(min-width:320px) 100vw, 100vw"
                className="absolute !top-2 left-0 aspect-square !h-16 !w-auto rounded brightness-120"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gradient-yellow">{player.name}</span>
              <Badge title="Total Level" value={player.totalLevel} />
            </div>
          </div>
        );
      },
    },
  ];

  const data = useMemo(() => {
    return Array.isArray(guildsList) ? guildsList : [];
  }, [guildsList]);

  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      bestPlayer: screenSizes.lg,
      participants: screenSizes.xs,
      killToExpRatio: screenSizes.md,
    }));
  }, [screenSizes]);

  const table = useReactTable<GuildEntry>({
    columns,
    data: mockData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    state: {
      columnVisibility,
    },
  });

  const getColorByPosition = (position: number) =>
    cn({
      'text-amber-900': position === 3,
      'text-slate-400': position === 2,
      'text-yellow-light': position === 1,
    });

  if (!isContentLoaded) {
    return (
      <div id={id} className="bg-card flex flex-col items-center justify-center gap-4 rounded-md p-40">
        Loading...
      </div>
    );
  }

  return (
    <div id={id} className="bg-card flex flex-col gap-4 rounded-md p-4">
      {/* Filters */}

      {!isContentLoaded ? (
        <div className="flex w-full items-center justify-center p-40">Loading...</div>
      ) : (
        <>
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-medium capitalize">Top guilds list</h3>
              <span className="text-foreground-darker text-sm">Track which guild rules the region</span>
            </div>
            <LocationSelect locations={locations} onSelect={onSelectLocation} />
          </div>

          <Separator />

          <div
            className={cn(
              'grid',
              'grid-cols-[--spacing(10)_1fr_100px_90px]',
              'xs:grid-cols-[--spacing(11)_2fr_1fr_1fr_1fr]',
              'md:grid-cols-[--spacing(12)_2fr_1fr_1fr_1fr_1fr]',
              'lg:grid-cols-[--spacing(13)_2fr_1fr_1fr_1fr_1fr_2fr]',
              '',
            )}
          >
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => {
                return (
                  <div key={header.id} className={cn('p-2 text-base font-bold text-gray-300 md:text-lg')}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                );
              }),
            )}

            {table.getRowModel().rows.map((row) =>
              row.getVisibleCells().map((cell) => {
                return (
                  <div
                    key={cell.id}
                    className={cn(
                      'flex items-center border-b p-2 text-sm font-bold md:text-base',
                      cell.column.id === 'position' && 'justify-center',
                      row.index % 2 === 1 && 'bg-black/10',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );
              }),
            )}
          </div>
          <PaginationControls table={table} />
        </>
      )}
    </div>
  );
};
