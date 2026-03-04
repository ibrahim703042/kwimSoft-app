import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Période", accessorKey: "period" },
  {
    header: "Prévu",
    accessorKey: "plannedAmount",
    cell: ({ row }: any) => `${(row.original.plannedAmount || 0).toLocaleString()}`,
  },
  {
    header: "Réel",
    accessorKey: "actualAmount",
    cell: ({ row }: any) => `${(row.original.actualAmount || 0).toLocaleString()}`,
  },
  {
    header: "Restant",
    accessorKey: "remainingAmount",
    cell: ({ row }: any) => {
      const planned = row.original.plannedAmount || 0;
      const actual = row.original.actualAmount || 0;
      const remaining = row.original.remainingAmount ?? (planned - actual);
      return `${remaining.toLocaleString()}`;
    },
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const labels: Record<string, string> = {
        draft: "Brouillon",
        active: "Actif",
        closed: "Clôturé",
      };
      return labels[s] || (s || "").toUpperCase();
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du budget", required: true },
  { name: "period", label: "Période", type: "text", placeholder: "Ex: Q1 2026" },
  { name: "plannedAmount", label: "Montant prévu", type: "number", placeholder: "0", min: 0 },
  { name: "actualAmount", label: "Montant réel", type: "number", placeholder: "0", min: 0 },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "active", label: "Actif" },
      { value: "closed", label: "Clôturé" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes sur le budget", colSpan: 2 },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  period: z.string().optional(),
  plannedAmount: z.number().default(0),
  actualAmount: z.number().default(0),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

const BudgetPage = createFullEntityPage({
  key: "budget",
  title: "Budgets",
  singular: "Budget",
  endpoint: "/budget",
  service: "stock",
  permissionPrefix: "budget",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    period: "",
    plannedAmount: 0,
    actualAmount: 0,
    status: "draft",
    notes: "",
  },
});

export default BudgetPage;
