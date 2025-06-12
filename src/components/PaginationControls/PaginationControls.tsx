import { Button } from '@/components/Button';
import { TABLE_PAGE_SIZES } from '@/constants';
import { Table } from '@tanstack/react-table';

interface PaginationControlsProps<T> {
  table: Table<T>;
  disabled?: boolean;
}

export const PaginationControls = <T,>({ table, disabled }: PaginationControlsProps<T>) => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={disabled ?? !table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button variant="outline" onClick={table.nextPage} disabled={disabled ?? !table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};
