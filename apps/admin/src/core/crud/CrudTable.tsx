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
import { Button } from "@/components/ui/button";
import { Can } from "@/core/auth";
import { CrudPermissions } from "./types";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ClipboardPen, Trash2, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CrudTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  permissions?: CrudPermissions;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  customActions?: (row: T) => React.ReactNode;
}

export function CrudTable<T>({
  data = [],
  columns = [],
  isLoading = false,
  enablePagination = true,
  pageSize = 10,
  permissions,
  onEdit,
  onDelete,
  onView,
  customActions,
}: CrudTableProps<T>) {
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
            pageSize: pageSize,
          },
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

  const renderActions = (row: T) => {
    if (customActions) {
      return customActions(row);
    }

    const hasAnyAction = onEdit || onDelete || onView;
    if (!hasAnyAction) return null;

    return (
      <div className="flex items-center space-x-2">
        {onEdit && (
          <Can permission={permissions?.update} silent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span onClick={() => onEdit(row)}>
                    <Button size="sm" className="p-2">
                      <ClipboardPen size={16} />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Can>
        )}

        {onView && (
          <Can permission={permissions?.read} silent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span onClick={() => onView(row)}>
                    <Button variant="outline" size="sm" className="p-2">
                      <Eye size={16} />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Can>
        )}

        {onDelete && (
          <Can permission={permissions?.delete} silent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span onClick={() => onDelete(row)}>
                    <Button variant="destructive" size="sm" className="p-2">
                      <Trash2 size={16} />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Can>
        )}
      </div>
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
                {(onEdit || onDelete || onView || customActions) && (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center whitespace-nowrap"
                >
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
                  {(onEdit || onDelete || onView || customActions) && (
                    <TableCell>{renderActions(row.original)}</TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center whitespace-nowrap"
                >
                  <p className="text-[0.8rem] text-red-500">No data found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && table.getPageCount() > 0 && (
        <div className="flex items-center justify-end space-x-2 py-3 px-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={`cursor-pointer ${
                    !table.getCanPreviousPage() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: table.getPageCount() }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={index === table.getState().pagination.pageIndex}
                    onClick={() => table.setPageIndex(index)}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={`cursor-pointer ${
                    !table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
