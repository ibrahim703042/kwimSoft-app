import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Reference", accessorKey: "reference" },
  { header: "Product", accessorKey: "product", cell: ({ row }: any) => row.original.product?.name || "—" },
  { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
  { header: "Quantity", accessorKey: "quantity" },
  { header: "From", accessorKey: "sourceLocation", cell: ({ row }: any) => row.original.sourceLocation?.name || "—" },
  { header: "To", accessorKey: "destinationLocation", cell: ({ row }: any) => row.original.destinationLocation?.name || "—" },
  { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
  { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "Réf. auto-générée" },
  { name: "product", label: "Produit (ID)", type: "text", required: true },
  { name: "type", label: "Type", type: "select", required: true, options: [
    { value: "inbound", label: "Entrée" },
    { value: "outbound", label: "Sortie" },
    { value: "internal", label: "Interne" },
    { value: "adjustment", label: "Ajustement" },
    { value: "return", label: "Retour" },
  ]},
  { name: "quantity", label: "Quantité", type: "number", min: 1, required: true },
  { name: "sourceLocation", label: "Emplacement source (ID)", type: "text" },
  { name: "destinationLocation", label: "Emplacement destination (ID)", type: "text" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "status", label: "Statut", type: "select", options: [
    { value: "draft", label: "Brouillon" },
    { value: "confirmed", label: "Confirmé" },
    { value: "done", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
  ]},
  { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
];

const formSchema = z.object({
  reference: z.string().optional(),
  product: z.string().min(1, "Le produit est requis"),
  type: z.string().min(1, "Le type est requis"),
  quantity: z.number().min(1, "La quantité minimum est 1"),
  sourceLocation: z.string().optional(),
  destinationLocation: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

const StockMovementPage = createFullEntityPage({
  key: "stock-movement",
  title: "Mouvements de Stock",
  singular: "Mouvement",
  endpoint: "/stock-movement",
  service: "stock",
  permissionPrefix: "stock_movement",
  columns,
  formFields,
  formSchema,
  defaultValues: { reference: "", product: "", type: "", quantity: 1, sourceLocation: "", destinationLocation: "", date: "", status: "draft", notes: "" },
});

export default StockMovementPage;
