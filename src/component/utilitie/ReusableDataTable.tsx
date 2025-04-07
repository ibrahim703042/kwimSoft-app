import { useState, MouseEvent } from "react";
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

import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import Box from "@mui/material/Box";

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
import { IconButton } from "@mui/material";
import PacmanLoader from "react-spinners/PacmanLoader";

interface ReusableDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  customActions?: (row: T) => JSX.Element;
  ButtonIconsAdd?: JSX.Element;
  ComponentButtonAdd?: JSX.Element;
  titleDataTable?: string;
  isLoading?: boolean;
  pageSize?: number;
}


export function ReusableDataTable<T>({
  data = [],
  columns = [],
  enablePagination = true,
  customActions,
  ComponentButtonAdd,
  titleDataTable,
  isLoading = false,
  pageSize = 10,
}: ReusableDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

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

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 border-b">
        <div className="p-4 pb-0 border-b-2 border-[#1D3686]">
          <p className="text-[#1D3686] text-[0.9rem] font-medium inline-block pb-3">
            {titleDataTable}
          </p>
        </div>
      </div>

      <div className="mt-3 px-3 flex items-center gap-3 justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="border inline-block p-1 px-3 rounded-lg">
            <FileDownloadSharpIcon sx={{ color: "#707EAE", fontSize: "18px" }} />
          </div>
          <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            />
          </Box>
        </div>
        <div className="flex items-center space-x-3">{ComponentButtonAdd}</div>
      </div>

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
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center whitespace-nowrap">
                  <div className="w-full flex justify-center">
                    <PacmanLoader size={10} color="#0F123F" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {customActions && <TableCell>{customActions(row.original)}</TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center whitespace-nowrap">
                  <p className="text-[0.8rem] text-red-500">Aucune donnée trouvée</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
