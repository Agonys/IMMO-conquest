'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/Badge';
import { ColumnDef, VisibilityState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMediaQuery } from '@uidotdev/usehooks';

// import { useMediaQuery } from '@uidotdev/usehooks';

interface GuildsCardProps {
  id: string;
}

interface GuildEntry {
  position: number;
  guildName: string;
  guildIcon: string;
  totalExp: number;
  kills: number;
  participants: number;
  guildSize: number;
  bestPlayer: {
    name: string;
    totalLevel: number;
    avatar: string;
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
    participants: 19,
    guildSize: 25,
    bestPlayer: {
      name: 'DefiasBandit',
      totalLevel: 855,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01JRG6NJGPFS1MS7A187XQJ9RQ.png',
    },
  },
  {
    position: 2,
    guildName: 'France',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJWHWABR02S7SKBMFH45R0.png',
    totalExp: 145168,
    kills: 49015,
    participants: 14,
    guildSize: 25,
    bestPlayer: {
      name: 'Sylrus',
      totalLevel: 1558,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/fdc0ekyIhrToEBwkGNSeuFOpCr0oYW-metaU3Zlcm5vbSAocmVwbGFjZSB0aGUgb2xkIG9uZSkucG5n-.png',
    },
  },
  {
    position: 3,
    guildName: 'RAWR',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJV939YW1AA7M76BW0BWN6.png',
    totalExp: 70812,
    kills: 26660,
    participants: 18,
    guildSize: 25,
    bestPlayer: {
      name: 'RudiTabuti',
      totalLevel: 1500,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HP21WJNBFY28A3QPT9H0TAKR.png',
    },
  },
  {
    position: 4,
    guildName: 'END',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQJXXGRYKS0WXJVT3QNMY3D.png',
    totalExp: 31166,
    kills: 9332,
    participants: 10,
    guildSize: 25,
    bestPlayer: {
      name: 'JohnGroham',
      totalLevel: 1732,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HT2CE4FZ9JHQ8DWKVC9YY1R1.png',
    },
  },
  {
    position: 5,
    guildName: 'Stay Frosty',
    guildIcon:
      'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/01HQQK4KJEJCR6H8DX9B8XZGFR.png',
    totalExp: 6458,
    kills: 3249,
    participants: 7,
    guildSize: 25,
    bestPlayer: {
      name: 'Tennzor',
      totalLevel: 1522,
      avatar:
        'https://cdn.idle-mmo.com/cdn-cgi/image/width=100,height=100/uploaded/skins/7dWkSMBekaGH1FMaPvMUeJBmO6hLx8-metaQXN0YXJvdGgucG5n-.png',
    },
  },
] satisfies GuildEntry[];

export const GuildsCard = ({ id }: GuildsCardProps) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const isMobile = useMediaQuery('only screen and (max-width: 768px)');
  const areParticipantsVisible = useMediaQuery('only screen and (min-width: 576px)');

  const columns: ColumnDef<GuildEntry>[] = [
    {
      accessorKey: 'position',
      header: () => <div className="md:pl-2">#</div>,
      cell: ({ getValue, row }) => {
        const { position } = row.original;
        const isPodium = position <= 3;

        return isPodium ? (
          <Trophy strokeWidth={1.5} size={32} className={clsx(getColorByPosition(position))} />
        ) : (
          <div
            className={clsx(
              'flex aspect-square w-10 items-center justify-center rounded-full text-base font-bold',
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
          <Image src={row.original.guildIcon} alt={row.original.guildName} height={48} width={48} className="rounded" />
          <span className="text-base font-semibold">{row.original.guildName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalExp',
      header: () => <div>EXP</div>,
      cell: ({ getValue }) => <div className="text-base font-bold">{getValue<number>().toLocaleString()}</div>,
    },
    {
      accessorKey: 'kills',
      header: () => <div>Kills</div>,
      cell: ({ getValue }) => <div>{getValue<number>().toLocaleString()}</div>,
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
            <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-full border">
              <Image
                src={player.avatar}
                alt={player.name}
                fill
                className="absolute !top-2 left-0 aspect-square !h-16 !w-auto rounded"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span>{player.name}</span>
              <Badge title="Total Level" value={player.totalLevel} />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      bestPlayer: !isMobile,
      participants: areParticipantsVisible,
    }));
  }, [isMobile, areParticipantsVisible]);

  const table = useReactTable<GuildEntry>({
    columns,
    data: mockData,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  const getColorByPosition = (position: number) =>
    clsx({
      'text-amber-900': position === 3,
      'text-slate-400': position === 2,
      'text-yellow-light': position === 1,
    });

  return (
    <div id={id} className="bg-card flex flex-col gap-8 rounded-md p-4">
      {/* Filters */}
      <div className="bg-card-header relative flex w-fit flex-col overflow-hidden rounded-md">
        <div className="flex justify-between gap-10 px-4 py-2">
          <p className="z-10 font-bold text-shadow-lg">Bluebell Hollow</p>
          <Badge title="Kills" value="115K" solid className="z-10" />
        </div>
        <div className="relative flex h-15 w-full items-center justify-center">
          <div className="absolute z-10 h-full w-full bg-black/40" />
          <Image
            src="https://cdn.idle-mmo.com/cdn-cgi/image/width=400/uploaded/skins/XAo5lbIDq0CmH2M9LYWpre41Pta3MX-metaZmFybS5wbmc=-.png"
            alt="bluebell hollow"
            fill
            className="absolute z-0"
          />

          <div className="text-outline-black z-10 flex items-center gap-2">
            <Image src={mockData[3].guildIcon} alt={mockData[3].guildName} height={48} width={48} className="rounded" />
            <span className="text-base font-semibold">{mockData[3].guildName}</span>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'grid',
          'grid-cols-[--spacing(10)_1fr_100px_90px]',
          areParticipantsVisible && 'grid-cols-[--spacing(10)_1fr_100px_90px_1fr]',
          !isMobile && areParticipantsVisible && 'grid-cols-[--spacing(16)_1fr_1fr_1fr_1fr_1fr]',
        )}
      >
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            return (
              <div key={header.id} className={clsx('p-2 text-lg font-bold text-gray-300')}>
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
                className={clsx(
                  'flex items-center border-b p-2 text-base font-bold',
                  cell.column.id === 'position' && 'justify-center',
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};
