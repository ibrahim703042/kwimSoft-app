import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  confirmed: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  planned: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  in_progress: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  done: "bg-green-100 text-green-700 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

const statusLabels: Record<string, string> = {
  draft: "BROUILLON",
  confirmed: "CONFIRMÉ",
  planned: "PLANIFIÉ",
  in_progress: "EN COURS",
  done: "TERMINÉ",
  cancelled: "ANNULÉ",
};

const priorityIcons: Record<string, string> = {
  low: "⬇",
  normal: "—",
  high: "⬆",
  urgent: "🔴",
};

export const moColumns: ColumnDef<any>[] = [
  { header: "Référence", accessorKey: "reference" },
  {
    header: "Produit",
    accessorKey: "product",
    cell: ({ row }) => row.original.product?.name || row.original.product || "—",
  },
  {
    header: "Quantité",
    accessorKey: "quantity",
    cell: ({ row }) =>
      `${row.original.quantity ?? 0} ${row.original.uom || "Unit(s)"}`,
  },
  {
    header: "Date planifiée",
    accessorKey: "scheduledDate",
    cell: ({ row }) =>
      row.original.scheduledDate
        ? new Date(row.original.scheduledDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Priorité",
    accessorKey: "priority",
    cell: ({ row }) => {
      const p = row.original.priority || "normal";
      return `${priorityIcons[p] || ""} ${p.charAt(0).toUpperCase() + p.slice(1)}`;
    },
  },
  {
    header: "Composants",
    accessorKey: "components",
    cell: ({ row }) => row.original.components?.length || 0,
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
