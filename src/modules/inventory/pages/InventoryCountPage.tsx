import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Reference", accessorKey: "reference" },
  { header: "Warehouse", accessorKey: "warehouse", cell: ({ row }: any) => row.original.warehouse?.name || "—" },
  { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
  { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "Réf. inventaire" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "warehouse", label: "Entrepôt (ID)", type: "text", required: true },
  { name: "status", label: "Statut", type: "select", options: [
    { value: "draft", label: "Brouillon" },
    { value: "in_progress", label: "En cours" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
  ]},
  { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
];

const formSchema = z.object({
  reference: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  warehouse: z.string().min(1, "L'entrepôt est requis"),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

const InventoryCountPage = createFullEntityPage({
  key: "inventory-count",
  title: "Inventaires",
  singular: "Inventaire",
  endpoint: "/inventory-count",
  service: "stock",
  permissionPrefix: "inventory_count",
  columns,
  formFields,
  formSchema,
  defaultValues: { reference: "", date: "", warehouse: "", status: "draft", notes: "" },
});

export default InventoryCountPage;
