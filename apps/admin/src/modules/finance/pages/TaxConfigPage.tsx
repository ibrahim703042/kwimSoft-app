import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  {
    header: "Taux (%)",
    accessorKey: "rate",
    cell: ({ row }: any) => `${row.original.rate ?? 0}%`,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const labels: Record<string, string> = {
        vat: "TVA",
        sales_tax: "Taxe de vente",
        withholding: "Retenue à la source",
        excise: "Accise",
      };
      return labels[row.original.type] || (row.original.type || "").toUpperCase();
    },
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) =>
      row.original.isActive !== false ? "✓ Oui" : "✗ Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la taxe", required: true },
  { name: "code", label: "Code", type: "text", placeholder: "Ex: TVA16", required: true },
  { name: "rate", label: "Taux (%)", type: "number", placeholder: "0.00", min: 0, step: 0.01 },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "vat", label: "TVA" },
      { value: "sales_tax", label: "Taxe de vente" },
      { value: "withholding", label: "Retenue à la source" },
      { value: "excise", label: "Accise" },
    ],
  },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette taxe est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  rate: z.number().default(0),
  type: z.string().optional(),
  isActive: z.boolean().default(true),
});

const TaxConfigPage = createFullEntityPage({
  key: "tax-config",
  title: "Configuration fiscale",
  singular: "Taxe",
  endpoint: "/tax-config",
  service: "stock",
  permissionPrefix: "tax_config",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    code: "",
    rate: 0,
    type: "",
    isActive: true,
  },
});

export default TaxConfigPage;
