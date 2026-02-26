import { useState, useMemo } from "react";
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
import { CrudPermissions } from "./types";
import PacmanLoader from "react-spinners/PacmanLoader";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
} from "@kwim/shared-ui";

interface CrudTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  permissions?: CrudPermissions;
  checkPermission?: (permission?: string) => boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  customActions?: (row: T) => React.ReactNode;
  /** Enable row selection with checkboxes and optional bulk delete */
  enableRowSelection?: boolean;
  /** Return unique id for each row (required for selection when data has an id field) */
  getRowId?: (row: T) => string;
  /** Called when user triggers bulk delete; receives selected rows */
  onBulkDelete?: (rows: T[]) => void;
}

export function CrudTable<T>({
  data = [],
  columns = [],
  isLoading = false,
  enablePagination = true,
  pageSize = 10,
  permissions,
  checkPermission = () => true,
  onEdit,
  onDelete,
  onView,
  customActions,
  enableRowSelection = false,
  getRowId,
  onBulkDelete,
}: CrudTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columnsWithSelection = useMemo(() => {
    if (!enableRowSelection) return columns;
    const selectColumn: ColumnDef<T> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    return [selectColumn, ...columns];
  }, [enableRowSelection, columns]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    ...(getRowId && { getRowId: (originalRow: T) => getRowId(originalRow) }),
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
    enableRowSelection,
  });

  const renderActions = (row: T) => {
    if (customActions) {
      return customActions(row);
    }

    const hasAnyAction = onEdit || onDelete || onView;
    if (!hasAnyAction) return null;

    return (
      <div className="flex items-center space-x-2">
        {onEdit && checkPermission(permissions?.update) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="p-2" onClick={() => onEdit(row)}>
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onView && checkPermission(permissions?.read) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="p-2" onClick={() => onView(row)}>
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onDelete && checkPermission(permissions?.delete) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="sm" className="p-2" onClick={() => onDelete(row)}>
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original);
  const hasSelection = enableRowSelection && selectedRows.length > 0 && onBulkDelete;

  const handleBulkDelete = () => {
    if (selectedRows.length && onBulkDelete) {
      onBulkDelete(selectedRows);
      setRowSelection({});
    }
  };

  return (
    <div className="w-full min-w-0">
      {hasSelection && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-2 rounded-t-md border border-b-0 bg-muted/50">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              Clear selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete selected
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
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
                  colSpan={columnsWithSelection.length + ((onEdit || onDelete || onView || customActions) ? 1 : 0)}
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
                  colSpan={columnsWithSelection.length + ((onEdit || onDelete || onView || customActions) ? 1 : 0)}
                  className="h-24 text-center whitespace-nowrap"
                >
                  <p className="text-[0.8rem] text-red-500">No data found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {enablePagination && pageCount > 0 && (
        <div className="flex items-center justify-between space-x-2 py-3 px-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
