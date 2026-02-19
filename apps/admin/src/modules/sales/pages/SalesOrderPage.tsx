import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "N° Commande", accessorKey: "orderNumber" },
  {
    header: "Client",
    accessorKey: "customer",
    cell: ({ row }: any) => row.original.customer?.name || "—",
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
    header: "Articles",
    accessorKey: "items",
    cell: ({ row }: any) => row.original.items?.length || row.original.lineCount || 0,
  },
  {
    header: "Total",
    accessorKey: "totalAmount",
    cell: ({ row }: any) =>
      `${row.original.totalAmount ?? 0} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        draft: "text-gray-500",
        confirmed: "text-blue-600",
        shipped: "text-indigo-600",
        delivered: "text-green-600",
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
  { name: "orderNumber", label: "N° Commande", type: "text", placeholder: "CMD-001" },
  { name: "customer", label: "Client (ID)", type: "text", placeholder: "ID du client" },
  { name: "orderDate", label: "Date de commande", type: "date", required: true },
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
      { value: "shipped", label: "Expédié" },
      { value: "delivered", label: "Livré" },
      { value: "cancelled", label: "Annulé" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes supplémentaires...", colSpan: 2 },
];

const formSchema = z.object({
  orderNumber: z.string().optional(),
  customer: z.string().optional(),
  orderDate: z.string().min(1, "La date est requise"),
  totalAmount: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

const SalesOrderPage = createFullEntityPage({
  key: "order",
  title: "Commandes",
  singular: "Commande",
  endpoint: "/order",
  service: "stock",
  permissionPrefix: "order",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    orderNumber: "",
    customer: "",
    orderDate: "",
    totalAmount: "",
    currency: "CDF",
    status: "draft",
    notes: "",
  },
});

export default SalesOrderPage;
