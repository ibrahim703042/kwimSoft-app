import { ColumnDef } from "@tanstack/react-table";
import { Box } from "lucide-react";

export const productColumns: ColumnDef<any>[] = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) =>
      row.original.image ? (
        <img src={row.original.image} alt={row.original.name} className="w-10 h-10 rounded object-cover" />
      ) : (
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
          <Box size={16} className="text-muted-foreground" />
        </div>
      ),
  },
  { header: "Nom", accessorKey: "name" },
  { header: "Réf.", accessorKey: "internalRef" },
  {
    header: "Type",
    accessorKey: "productType",
    cell: ({ row }) => {
      const t = row.original.productType || row.original.type;
      const labels: Record<string, string> = { goods: "Biens", service: "Service", combo: "Combo" };
      return <span className="capitalize">{labels[t] || t || "—"}</span>;
    },
  },
  {
    header: "Prix",
    accessorKey: "price",
    cell: ({ row }) => {
      const p = row.original.price;
      return p != null && p !== "" ? `${p} ${row.original.currency || "CDF"}` : "—";
    },
  },
  {
    header: "Vente",
    accessorKey: "canBeSold",
    cell: ({ row }) => (row.original.canBeSold ? "✓" : "—"),
  },
  {
    header: "Achat",
    accessorKey: "canBePurchased",
    cell: ({ row }) => (row.original.canBePurchased ? "✓" : "—"),
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status;
      const colors: Record<string, string> = { active: "text-green-600", draft: "text-gray-500", archived: "text-red-600" };
      const labels: Record<string, string> = { active: "Actif", draft: "Brouillon", archived: "Archivé" };
      return <span className={`font-medium ${colors[s] || ""}`}>{labels[s] || s || "—"}</span>;
    },
  },
];
