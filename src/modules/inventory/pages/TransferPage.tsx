import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { RelationalField } from "@/core/crud/RelationalField";

const columns = [
  { header: "Reference", accessorKey: "reference" },
  { header: "From", accessorKey: "sourceWarehouse", cell: ({ row }: any) => row.original.sourceWarehouse?.name || "—" },
  { header: "To", accessorKey: "destinationWarehouse", cell: ({ row }: any) => row.original.destinationWarehouse?.name || "—" },
  { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || 0 },
  { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
  { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "Réf. transfert" },
  { name: "date", label: "Date", type: "date", required: true },
  {
    name: "sourceWarehouse",
    label: "Entrepôt source",
    type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form}
        name="sourceWarehouse"
        label="Entrepôt source"
        service="stock"
        endpoint="/warehouse"
        displayField="name"
        placeholder="Chercher..."
        required
      />
    ),
  },
  {
    name: "destinationWarehouse",
    label: "Entrepôt destination",
    type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form}
        name="destinationWarehouse"
        label="Entrepôt destination"
        service="stock"
        endpoint="/warehouse"
        displayField="name"
        placeholder="Chercher..."
        required
      />
    ),
  },
  { name: "status", label: "Statut", type: "select", options: [
    { value: "draft", label: "Brouillon" },
    { value: "in_transit", label: "En transit" },
    { value: "received", label: "Reçu" },
    { value: "cancelled", label: "Annulé" },
  ]},
  { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
];

const formSchema = z.object({
  reference: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  sourceWarehouse: z.string().min(1, "L'entrepôt source est requis"),
  destinationWarehouse: z.string().min(1, "L'entrepôt destination est requis"),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

const TransferPage = createFullEntityPage({
  key: "transfer",
  title: "Transferts",
  singular: "Transfert",
  endpoint: "/transfer",
  service: "stock",
  permissionPrefix: "transfer",
  columns,
  formFields,
  formSchema,
  defaultValues: { reference: "", date: "", sourceWarehouse: "", destinationWarehouse: "", status: "draft", notes: "" },
});

export default TransferPage;
