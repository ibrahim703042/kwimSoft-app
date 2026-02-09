import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "N° BC", accessorKey: "orderNumber" },
  {
    header: "Fournisseur",
    accessorKey: "supplier",
    cell: ({ row }: any) => row.original.supplier?.name || "—",
  },
  {
    header: "Date",
    accessorKey: "orderDate",
    cell: ({ row }: any) =>
      row.original.orderDate
        ? new Date(row.original.orderDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Total",
    accessorKey: "totalAmount",
    cell: ({ row }: any) =>
      `${row.original.totalAmount ?? 0} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Articles",
    accessorKey: "items",
    cell: ({ row }: any) => row.original.items?.length || 0,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        draft: "text-gray-500",
        confirmed: "text-blue-600",
        received: "text-green-600",
        cancelled: "text-red-600",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {(s || "—").toUpperCase()}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "orderNumber", label: "N° Commande", type: "text", placeholder: "PO-001" },
  { name: "supplier", label: "Fournisseur (ID)", type: "text", placeholder: "ID du fournisseur" },
  { name: "orderDate", label: "Date de commande", type: "date", required: true },
  { name: "expectedDate", label: "Date prévue", type: "date" },
  { name: "totalAmount", label: "Montant total", type: "number", placeholder: "0", min: 0 },
  {
    name: "currency",
    label: "Devise",
    type: "select",
    options: [
      { value: "CDF", label: "CDF" },
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "confirmed", label: "Confirmé" },
      { value: "received", label: "Reçu" },
      { value: "cancelled", label: "Annulé" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes supplémentaires...", colSpan: 2 },
];

const formSchema = z.object({
  orderNumber: z.string().optional(),
  supplier: z.string().optional(),
  orderDate: z.string().min(1, "La date est requise"),
  expectedDate: z.string().optional(),
  totalAmount: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

const PurchaseOrderPage = createFullEntityPage({
  key: "purchase-order",
  title: "Bons de commande",
  singular: "Bon de commande",
  endpoint: "/purchase-order",
  service: "stock",
  permissionPrefix: "purchase_order",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    orderNumber: "",
    supplier: "",
    orderDate: "",
    expectedDate: "",
    totalAmount: "",
    currency: "CDF",
    status: "draft",
    notes: "",
  },
});

export default PurchaseOrderPage;
