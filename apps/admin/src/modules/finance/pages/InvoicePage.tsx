import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "N° Facture", accessorKey: "invoiceNumber" },
  { header: "Client", accessorKey: "customerName" },
  {
    header: "Date",
    accessorKey: "invoiceDate",
    cell: ({ row }: any) =>
      row.original.invoiceDate
        ? new Date(row.original.invoiceDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Échéance",
    accessorKey: "dueDate",
    cell: ({ row }: any) =>
      row.original.dueDate
        ? new Date(row.original.dueDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Total",
    accessorKey: "totalAmount",
    cell: ({ row }: any) =>
      `${(row.original.totalAmount || 0).toLocaleString()} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Payé",
    accessorKey: "amountPaid",
    cell: ({ row }: any) => `${(row.original.amountPaid || 0).toLocaleString()}`,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        draft: "text-gray-500",
        sent: "text-blue-600",
        paid: "text-green-600",
        overdue: "text-red-600",
        cancelled: "text-red-400",
      };
      const labels: Record<string, string> = {
        draft: "Brouillon",
        sent: "Envoyée",
        paid: "Payée",
        overdue: "En retard",
        cancelled: "Annulée",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {labels[s] || (s || "").toUpperCase()}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "invoiceNumber", label: "N° Facture", type: "text", placeholder: "FAC-001" },
  { name: "customerName", label: "Client", type: "text", placeholder: "Nom du client", required: true },
  { name: "invoiceDate", label: "Date de facturation", type: "date", required: true },
  { name: "dueDate", label: "Date d'échéance", type: "date" },
  { name: "totalAmount", label: "Montant total", type: "number", placeholder: "0", min: 0 },
  { name: "amountPaid", label: "Montant payé", type: "number", placeholder: "0", min: 0 },
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
      { value: "sent", label: "Envoyée" },
      { value: "paid", label: "Payée" },
      { value: "overdue", label: "En retard" },
      { value: "cancelled", label: "Annulée" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes supplémentaires", colSpan: 2 },
];

const formSchema = z.object({
  invoiceNumber: z.string().optional(),
  customerName: z.string().min(1, "Le nom du client est requis"),
  invoiceDate: z.string().min(1, "La date de facturation est requise"),
  dueDate: z.string().optional(),
  totalAmount: z.number().default(0),
  amountPaid: z.number().default(0),
  currency: z.string().default("CDF"),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

const InvoicePage = createFullEntityPage({
  key: "invoice",
  title: "Factures",
  singular: "Facture",
  endpoint: "/invoice",
  service: "stock",
  permissionPrefix: "invoice",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    invoiceNumber: "",
    customerName: "",
    invoiceDate: "",
    dueDate: "",
    totalAmount: 0,
    amountPaid: 0,
    currency: "CDF",
    status: "draft",
    notes: "",
  },
});

export default InvoicePage;
