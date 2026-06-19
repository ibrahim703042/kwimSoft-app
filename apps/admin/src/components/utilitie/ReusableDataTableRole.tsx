/**
 * @deprecated Use CrudTable from @kwim/core instead. This legacy MUI-based table will be removed.
 */
import { useState } from "react";
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
} from "@tanstack/react-table";


import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PacmanLoader from "react-spinners/PacmanLoader";

interface ReusableDataTableRoleProps<T> {
  readonly data: T[];
  readonly columns: ColumnDef<T>[];
  readonly enablePagination?: boolean;
  readonly customActions?: (row: T) => JSX.Element;
  readonly isLoading?: boolean;
  readonly pageSize?: number;
}


export function ReusableDataTableRole<T>({
  data = [],
  columns = [],
  enablePagination = true,
  customActions,
  isLoading = false,
  pageSize = 10,
}: Readonly<ReusableDataTableRoleProps<T>>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    initialState: enablePagination
      ? {
        pagination: {
          pageSize: pageSize
        }
      }
      : undefined,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center whitespace-nowrap">
            <div className="w-full flex justify-center">
              <PacmanLoader size={10} color="#0F123F" />
            </div>
          </TableCell>
        </TableRow>
      );
    }
    if (table.getRowModel().rows.length > 0) {
      return table.getRowModel().rows.map((row) => (
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
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center whitespace-nowrap">
          <p className="text-[0.8rem] text-destructive">Aucune donnée trouvée</p>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>

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
