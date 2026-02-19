import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { RelationalField } from "@/core/crud/RelationalField";

const columns = [
  { header: "N° Devis", accessorKey: "quotationNumber" },
  {
    header: "Client",
    accessorKey: "customer",
    cell: ({ row }: any) => row.original.customer?.name || "—",
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }: any) =>
      row.original.date
        ? new Date(row.original.date).toLocaleDateString()
        : "—",
  },
  {
    header: "Valide jusqu'au",
    accessorKey: "validUntil",
    cell: ({ row }: any) =>
      row.original.validUntil
        ? new Date(row.original.validUntil).toLocaleDateString()
        : "—",
  },
  {
    header: "Total",
    accessorKey: "totalAmount",
    cell: ({ row }: any) => `${row.original.totalAmount ?? 0}`,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        draft: "text-gray-500",
        sent: "text-blue-600",
        accepted: "text-green-600",
        declined: "text-red-600",
        expired: "text-orange-600",
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
  { name: "quotationNumber", label: "N° Devis", type: "text", placeholder: "DEV-001" },
  {
    name: "customer",
    label: "Client",
    type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form}
        name="customer"
        label="Client"
        service="stock"
        endpoint="/customer"
        displayField="name"
        placeholder="Chercher client..."
      />
    ),
  },
  { name: "date", label: "Date", type: "date" },
  { name: "validUntil", label: "Valide jusqu'au", type: "date" },
  { name: "totalAmount", label: "Montant total", type: "number", placeholder: "0", min: 0 },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "sent", label: "Envoyé" },
      { value: "accepted", label: "Accepté" },
      { value: "declined", label: "Refusé" },
      { value: "expired", label: "Expiré" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes supplémentaires...", colSpan: 2 },
];

const formSchema = z.object({
  quotationNumber: z.string().optional(),
  customer: z.string().optional(),
  date: z.string().optional(),
  validUntil: z.string().optional(),
  totalAmount: z.number().min(0).optional().or(z.literal("")),
  status: z.string().optional(),
  notes: z.string().optional(),
});

const QuotationPage = createFullEntityPage({
  key: "quotation",
  title: "Devis",
  singular: "Devis",
  endpoint: "/quotation",
  service: "stock",
  permissionPrefix: "quotation",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    quotationNumber: "",
    customer: "",
    date: "",
    validUntil: "",
    totalAmount: "",
    status: "draft",
    notes: "",
  },
});

export default QuotationPage;
