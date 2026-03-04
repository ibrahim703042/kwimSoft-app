import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Type", accessorKey: "type" },
  { header: "Remise %", accessorKey: "discountPercentage" },
  { header: "Qté min.", accessorKey: "minQuantity" },
  {
    header: "Valide du",
    accessorKey: "validFrom",
    cell: ({ row }: any) =>
      row.original.validFrom
        ? new Date(row.original.validFrom).toLocaleDateString()
        : "—",
  },
  {
    header: "Valide au",
    accessorKey: "validTo",
    cell: ({ row }: any) =>
      row.original.validTo
        ? new Date(row.original.validTo).toLocaleDateString()
        : "—",
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) => (row.original.isActive !== false ? "✓ Oui" : "✗ Non"),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la règle", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "percentage", label: "Pourcentage" },
      { value: "fixed", label: "Montant fixe" },
    ],
  },
  { name: "discountPercentage", label: "Pourcentage de remise", type: "number", placeholder: "0", min: 0, step: 0.01 },
  { name: "minQuantity", label: "Quantité minimale", type: "number", placeholder: "0", min: 0 },
  { name: "validFrom", label: "Valide du", type: "date" },
  { name: "validTo", label: "Valide au", type: "date" },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette règle est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().optional(),
  discountPercentage: z.number().min(0).optional().or(z.literal("")),
  minQuantity: z.number().min(0).optional().or(z.literal("")),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
  isActive: z.boolean().default(true),
});

const PricingRulePage = createFullEntityPage({
  key: "pricing-rule",
  title: "Règles de prix",
  singular: "Règle de prix",
  endpoint: "/pricing-rule",
  service: "stock",
  permissionPrefix: "pricing_rule",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    type: "",
    discountPercentage: "",
    minQuantity: "",
    validFrom: "",
    validTo: "",
    isActive: true,
  },
});

export default PricingRulePage;
