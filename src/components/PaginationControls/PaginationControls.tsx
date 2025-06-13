import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { TABLE_PAGE_SIZES } from '@/constants';
import { useMediaQuerySizes } from '@/hooks';
import { cn } from '@/utils';
import { Table } from '@tanstack/react-table';

interface PaginationControlsProps<T> {
  table: Table<T>;
  disabled?: boolean;
}

export const PaginationControls = <T,>({ table, disabled }: PaginationControlsProps<T>) => {
  const { screenSizes } = useMediaQuerySizes();
  return (
    <div className="flex justify-between md:items-center">
      <div className={cn('hidden flex-col gap-2', 'md:flex md:flex-row md:items-center')}>
        <span className="text-muted-foreground text-sm">Rows per page:</span>
        <select
          name="page-size-selector"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            const size = Number(e.target.value);
            table.setPageSize(size);
          }}
          className="border-input focus:ring-yellow-light h-8 rounded border bg-transparent px-2 text-sm focus-visible:ring-yellow-400"
        >
          {TABLE_PAGE_SIZES.map((size) => (
            <option key={size} value={size} className="bg-background">
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex w-full items-center justify-center gap-3 md:w-max">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={disabled ?? !table.getCanPreviousPage()}
          className={cn('p-2', screenSizes.md && 'px-4')}
        >
          {screenSizes.md ? 'Previous' : <ChevronLeft />}
        </Button>
        <span className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          className={cn('p-2', screenSizes.md && 'px-4')}
          variant="outline"
          onClick={table.nextPage}
          disabled={disabled ?? !table.getCanNextPage()}
        >
          {screenSizes.md ? 'Next' : <ChevronRight />}
        </Button>
      </div>
    </div>
  );
};
