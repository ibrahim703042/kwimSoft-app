import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  VisibilityState,
  RowSelectionState,
  ColumnFiltersState,
  Row,
} from "@tanstack/react-table";



import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReusableDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  customActions?: (row: T) => JSX.Element;
  ComponentButtonAdd?: JSX.Element;
  titleDataTable?: string;
  isLoading?: boolean;
  pageSize?: number;
}

function renderTableRows<T extends object>(
  isLoading: boolean,
  rows: Row<T>[],
  columnCount: number,
  customActions?: (row: T) => JSX.Element
) {
  const colSpan = columnCount + (customActions ? 1 : 0);

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center whitespace-nowrap">
          <div className="flex w-full justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center whitespace-nowrap">
          <p className="text-[0.8rem] text-red-500">Aucune donnée trouvée</p>
        </TableCell>
      </TableRow>
    );
  }

  return rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
      {customActions && <TableCell>{customActions(row.original)}</TableCell>}
    </TableRow>
  ));
}

export function ReusableDataTable<T extends object>({
  data = [],
  columns = [],
  enablePagination = true,
  enableRowSelection = false,
  customActions,
  ComponentButtonAdd,
  titleDataTable = "",
  isLoading = false,
  pageSize = 10,
}: Readonly<ReusableDataTableProps<T>>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable<T>({
    data,
    columns,
    initialState: enablePagination ? { pagination: { pageSize } } : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    enableRowSelection,
  });

  const rows = useMemo(() => table.getRowModel().rows, [table]);

  return (
    <div className="w-full">
      {/* Title */}
      {titleDataTable && (
        <div className="flex items-center space-x-4 border-b">
          <div className="border-b-2 border-primary p-4 pb-0">
            <p className="inline-block pb-3 text-sm font-medium text-primary">
              {titleDataTable}
            </p>
          </div>
        </div>
      )}

      <div className="mb-3 mt-3 flex items-center justify-between gap-3 px-3">
        <Button type="button" variant="outline" size="icon" aria-label="Exporter">
          <Download className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-3">{ComponentButtonAdd}</div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                {customActions && <TableHead>{/* Action Header */}</TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {renderTableRows(isLoading, rows, columns.length, customActions)}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-end space-x-2 py-3 px-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="cursor-pointer"
                />
              </PaginationItem>
              {Array.from({ length: table.getPageCount() }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={index === table.getState().pagination.pageIndex}
                    onClick={() => table.setPageIndex(index)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
