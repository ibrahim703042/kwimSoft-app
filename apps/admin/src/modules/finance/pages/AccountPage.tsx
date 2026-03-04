import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Code", accessorKey: "code" },
  { header: "Nom", accessorKey: "name" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const labels: Record<string, string> = {
        asset: "Actif",
        liability: "Passif",
        equity: "Capitaux propres",
        revenue: "Revenu",
        expense: "Dépense",
      };
      return labels[row.original.type] || (row.original.type || "").replace(/_/g, " ").toUpperCase();
    },
  },
  {
    header: "Solde",
    accessorKey: "balance",
    cell: ({ row }: any) =>
      `${(row.original.balance || 0).toLocaleString()} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) =>
      row.original.isActive !== false ? "✓ Oui" : "✗ Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "code", label: "Code", type: "text", placeholder: "Ex: 411000", required: true },
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du compte", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "asset", label: "Actif" },
      { value: "liability", label: "Passif" },
      { value: "equity", label: "Capitaux propres" },
      { value: "revenue", label: "Revenu" },
      { value: "expense", label: "Dépense" },
    ],
  },
  { name: "balance", label: "Solde", type: "number", placeholder: "0", min: 0 },
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
  { name: "description", label: "Description", type: "textarea", placeholder: "Description du compte", colSpan: 2 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce compte est-il actif ?" },
];

const formSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().optional(),
  balance: z.number().default(0),
  currency: z.string().default("CDF"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const AccountPage = createFullEntityPage({
  key: "account",
  title: "Comptes",
  singular: "Compte",
  endpoint: "/account",
  service: "stock",
  permissionPrefix: "account",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    code: "",
    name: "",
    type: "",
    balance: 0,
    currency: "CDF",
    description: "",
    isActive: true,
  },
});

export default AccountPage;
