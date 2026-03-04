import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const t = row.original.type;
      const labels: Record<string, string> = {
        retail: "Détail",
        wholesale: "Gros",
        promotional: "Promotionnel",
      };
      return labels[t] || t || "—";
    },
  },
  {
    header: "Montant",
    accessorKey: "amount",
    cell: ({ row }: any) =>
      row.original.amount != null ? row.original.amount : "—",
  },
  { header: "Devise", accessorKey: "currency" },
  {
    header: "Valide du",
    accessorKey: "validFrom",
    cell: ({ row }: any) =>
      row.original.validFrom
        ? new Date(row.original.validFrom).toLocaleDateString("fr-FR")
        : "—",
  },
  {
    header: "Valide au",
    accessorKey: "validTo",
    cell: ({ row }: any) =>
      row.original.validTo
        ? new Date(row.original.validTo).toLocaleDateString("fr-FR")
        : "—",
  },
];

const formFields: FieldConfig[] = [
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "retail", label: "Détail" },
      { value: "wholesale", label: "Gros" },
      { value: "promotional", label: "Promotionnel" },
    ],
  },
  { name: "amount", label: "Montant", type: "number", placeholder: "0", min: 0 },
  { name: "currency", label: "Devise", type: "text", placeholder: "CDF" },
  { name: "validFrom", label: "Valide du", type: "date" },
  { name: "validTo", label: "Valide au", type: "date" },
];

const formSchema = z.object({
  type: z.string().optional(),
  amount: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

const PricingPage = createFullEntityPage({
  key: "product-price",
  title: "Tarification",
  singular: "Prix",
  endpoint: "/product-price",
  service: "product",
  permissionPrefix: "product_price",
  columns,
  formFields,
  formSchema,
  defaultValues: { type: "", amount: "", currency: "CDF", validFrom: "", validTo: "" },
});

export default PricingPage;
