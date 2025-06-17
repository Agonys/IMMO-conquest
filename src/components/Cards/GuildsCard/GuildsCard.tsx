'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { LocationSelect } from '@/components/LocationSelect';
import { PaginationControls } from '@/components/PaginationControls';
import { Separator } from '@/components/Separator';
import { useGetGuilds, useMediaQuerySizes } from '@/hooks';
import { useGetLocations } from '@/hooks/query';
import { GuildEntry } from '@/types/guilds';
import { cn, getPublicImagePath } from '@/utils';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SortingButton } from './SortingButton';

interface GuildsCardProps {
  id: string;
}

const getColorByPosition = (position: number) =>
  cn({
    'text-amber-900': position === 3,
    'text-slate-400': position === 2,
    'text-yellow-light': position === 1,
  });

export const GuildsCard = ({ id }: GuildsCardProps) => {
  const { screenSizes } = useMediaQuerySizes();
  const [currentLocationKey, setCurrentLocationKey] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    bestPlayer: screenSizes.xl,
    participantsCount: screenSizes.sm,
    killToExpRatio: screenSizes.xl,
  });

  const { data: locations, isLoading: locationsIsLoading } = useGetLocations();
  const { data: guildsList, isLoading: guildsListIsLoading } = useGetGuilds();

  const isContentLoaded = useMemo(
    () => !locationsIsLoading && !guildsListIsLoading,
    [locationsIsLoading, guildsListIsLoading],
  );

  const onSelectLocation = (locationKey: string | null) => {
    setCurrentLocationKey(locationKey);
  };

  const columns: ColumnDef<GuildEntry>[] = [
    {
      id: 'id',
      header: () => <div className="md:pl-2">#</div>,
      cell: ({ row, table }) => {
        const actualIndex = table.getSortedRowModel().flatRows.findIndex((flatRow) => flatRow.id === row.id);
        if (actualIndex === -1) return 'NaN';

        const position = actualIndex + 1;
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
            {position}
          </div>
        );
      },
    },
    {
      accessorKey: 'guildName',
      header: ({ column }) => <SortingButton column={column}>Guild</SortingButton>,
      cell: ({ row }) => {
        return (
          <Link
            href={`https://web.idle-mmo.com/guilds?guild_id=${row.original.guildId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            {
              <Image
                src={getPublicImagePath(row.original.guildIcon)}
                alt={row.original.guildName}
                height={48}
                width={48}
                className={cn('aspect-square w-8 rounded', 'sm:w-10', 'md:w-12', 'lg:w-14')}
              />
            }
            <span>{row.original.guildName}</span>
          </Link>
        );
      },
    },
    {
      accessorKey: 'totalExp',
      header: ({ column }) => <SortingButton column={column}>EXP</SortingButton>,
      cell: ({ getValue }) => getValue<number>().toLocaleString(),
    },
    {
      accessorKey: 'kills',
      header: ({ column }) => <SortingButton column={column}>Kills</SortingButton>,
      cell: ({ getValue }) => getValue<number>().toLocaleString(),
    },
    {
      accessorKey: 'killToExpRatio',
      header: ({ column }) => <SortingButton column={column}>Ratio</SortingButton>,
    },
    {
      accessorKey: 'participantsCount',
      header: ({ column }) => <SortingButton column={column}>Participants</SortingButton>,
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: 'bestPlayer',
      accessorFn: (row) => row.bestPlayer.name,
      header: () => <div>Best Player</div>,
      cell: ({ row }) => {
        const player = row.original.bestPlayer;
        return (
          <Link
            className="flex items-center gap-4"
            href={`https://web.idle-mmo.com/@${player.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url(${getPublicImagePath(player.background)})` }}
            >
              <Image
                src={getPublicImagePath(player.avatar)}
                alt={player.name}
                fill
                sizes="(min-width:320px) 100vw, 100vw"
                className="absolute !top-2 left-0 aspect-square !h-16 !w-auto rounded brightness-120"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className={cn('flex flex-col items-start gap-1', screenSizes.xl && 'flex-row items-end')}>
                <span className={cn('leading-6', player.hasMembership && 'text-gradient-yellow')}>{player.name}</span>
                {screenSizes.xl ? (
                  <span className="text-foreground-darker text-xs leading-5 font-medium">
                    (Lv. {player.totalLevel})
                  </span>
                ) : (
                  <Badge title="Total Level" value={player.totalLevel} />
                )}
              </div>
              {screenSizes.xl && (
                <div className="flex gap-1">
                  <Badge title="Kills" value={player.kills.toLocaleString()} />
                  <Badge title="Exp" value={player.experience.toLocaleString()} />
                </div>
              )}
            </div>
          </Link>
        );
      },
    },
  ];

  const data = useMemo(() => {
    if (!Array.isArray(guildsList?.data)) return [];
    const existingGuilds = new Set<string>();

    return !currentLocationKey
      ? guildsList.data.filter(({ guildName }) => {
          if (existingGuilds.has(guildName)) return false;
          existingGuilds.add(guildName);
          return true;
        })
      : guildsList.data.filter((guild) => guild.locationKey === currentLocationKey);
  }, [currentLocationKey, guildsList]);

  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      bestPlayer: screenSizes.lg,
      participantsCount: screenSizes.xs,
      killToExpRatio: screenSizes.md,
    }));
  }, [screenSizes]);

  const table = useReactTable<GuildEntry>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [
        {
          id: 'totalExp',
          desc: true,
        },
      ],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    state: {
      columnVisibility,
    },
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

      <div className="flex w-full items-center justify-between gap-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-medium capitalize">Top guilds list</h3>
          <span className="text-foreground-darker text-sm">Track which guild rules the region</span>
          {guildsList?.updatedAt && (
            <span className="text-foreground-darker text-xs">
              Last update: {new Date(guildsList.updatedAt).toLocaleString()} UTC
            </span>
          )}
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

        {table.getRowModel().rows.map((row, i) =>
          row.getVisibleCells().map((cell) => {
            return (
              <div
                key={cell.id}
                className={cn(
                  'flex items-center border-b p-2 text-sm font-bold md:text-base',
                  cell.column.id === 'position' && 'justify-center',
                  i % 2 === 1 && 'bg-black/10',
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          }),
        )}
      </div>
      <PaginationControls table={table} />
    </div>
  );
};
