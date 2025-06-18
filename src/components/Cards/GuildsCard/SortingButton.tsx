import { ReactNode, useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { Button } from '@/components/Button';
import { GuildEntry } from '@/types/guilds';
import { Column } from '@tanstack/react-table';

interface SortingButtonProps {
  children: ReactNode;
  column: Column<GuildEntry, unknown>;
}

export const SortingButton = ({ children, column }: SortingButtonProps) => {
  const [sortingState, setSortingState] = useState(0);
  const handleCircularSorting = () => {
    switch (sortingState) {
      case 0:
        column.toggleSorting(true);
      case 1:
        column.toggleSorting(false);
      case 2:
        column.toggleSorting();
      default:
        break;
    }

    setSortingState((prev) => (prev + 1) % 3);
  };
  return (
    <Button
      variant="ghost"
      className="p-0 [font-size:inherit] [font-weight:inherit] focus:ring-1 focus:ring-white"
      onClick={handleCircularSorting}
    >
      {children}
      {column.getIsSorted() === 'desc' && <ArrowUpNarrowWide size={16} />}
      {column.getIsSorted() === 'asc' && <ArrowDownWideNarrow size={16} />}
    </Button>
  );
};
