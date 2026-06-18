import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

interface Column {
  id: string;
  label: string;
  numeric?: boolean;
}

interface EnhancedTableProps {
  columns?: Column[];
  data?: Array<Record<string, unknown> & { id?: string | number }>;
}

function descendingComparator(a: Record<string, unknown>, b: Record<string, unknown>, orderBy: string) {
  const av = a[orderBy];
  const bv = b[orderBy];
  if (bv == null || av == null) return 0;
  if (bv < av) return -1;
  if (bv > av) return 1;
  return 0;
}

function formatCellValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

type TableRowData = Record<string, unknown> & { id?: string | number };

function EnhancedTableRow({
  row,
  columns,
  isSelected,
  onToggle,
}: Readonly<{
  row: TableRowData;
  columns: Column[];
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
}>) {
  return (
    <TableRow key={String(row.id)} data-state={isSelected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(checked === true)}
          aria-label="Sélectionner la ligne"
        />
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column.id} className={column.numeric ? "text-right" : ""}>
          {formatCellValue(row[column.id])}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function EnhancedTable({ columns = [], data = [] }: Readonly<EnhancedTableProps>) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id ?? "");
  const [selected, setSelected] = useState<Array<string | number>>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const validData = Array.isArray(data) ? data : [];

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const visibleRows = useMemo(() => {
    const sorted = [...validData].sort((a, b) => {
      const cmp = descendingComparator(a, b, orderBy);
      return order === "desc" ? -cmp : cmp;
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [validData, order, orderBy, page, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(validData.length / rowsPerPage));

  if (!validData.length) {
    return <EmptyState title="Aucun enregistrement" />;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selected.length === validData.length && validData.length > 0}
                onCheckedChange={(checked) => {
                  setSelected(checked ? validData.map((n) => n.id!).filter(Boolean) : []);
                }}
                aria-label="Sélectionner tout"
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.numeric ? "text-right" : ""}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => {
            const rowId = row.id as string | number;
            return (
              <EnhancedTableRow
                key={String(rowId)}
                row={row}
                columns={columns}
                isSelected={selected.includes(rowId)}
                onToggle={(checked) => {
                  setSelected((prev) =>
                    checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
                  );
                }}
              />
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Lignes par page</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(v) => {
              setRowsPerPage(Number(v));
              setPage(0);
            }}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
