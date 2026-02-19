import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  submitted: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  dept_head: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  budget: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  purchasing: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  confirmed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  received: "bg-green-100 text-green-700 hover:bg-green-100",
  done: "bg-green-200 text-green-800 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

const statusLabels: Record<string, string> = {
  draft: "BROUILLON",
  submitted: "SOUMIS",
  dept_head: "CHEF DEPT",
  budget: "BUDGET",
  purchasing: "ACHAT",
  confirmed: "CONFIRMÉ",
  received: "REÇU",
  done: "TERMINÉ",
  cancelled: "ANNULÉ",
};

export const poColumns: ColumnDef<any>[] = [
  { header: "N° BC", accessorKey: "orderNumber" },
  {
    header: "Fournisseur",
    accessorKey: "supplier",
    cell: ({ row }) => row.original.supplier?.name || row.original.supplier || "—",
  },
  {
    header: "Département",
    accessorKey: "requisitionDept",
    cell: ({ row }) => row.original.requisitionDept || "—",
  },
  {
    header: "Date",
    accessorKey: "orderDate",
    cell: ({ row }) =>
      row.original.orderDate
        ? new Date(row.original.orderDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Date prévue",
    accessorKey: "expectedDate",
    cell: ({ row }) =>
      row.original.expectedDate
        ? new Date(row.original.expectedDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Total",
    accessorKey: "totalAmount",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const total = items.reduce((sum: number, it: any) => {
        const qty = Number(it.requestedQty) || 0;
        const price = Number(it.unitPrice) || 0;
        return sum + qty * price;
      }, 0);
      return `${total.toLocaleString()} ${row.original.currency || "CDF"}`;
    },
  },
  {
    header: "Articles",
    accessorKey: "items",
    cell: ({ row }) => row.original.items?.length || 0,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status || "draft";
      return (
        <Badge variant="secondary" className={statusColors[s] || ""}>
          {statusLabels[s] || s.toUpperCase()}
        </Badge>
      );
    },
  },
];
