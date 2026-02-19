import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Référence", accessorKey: "reference" },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }: any) =>
      row.original.date
        ? new Date(row.original.date).toLocaleDateString()
        : "—",
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }: any) => {
      const desc = row.original.description || "";
      return desc.length > 50 ? `${desc.slice(0, 50)}…` : desc;
    },
  },
  {
    header: "Débit",
    accessorKey: "totalDebit",
    cell: ({ row }: any) => `${(row.original.totalDebit || 0).toLocaleString()}`,
  },
  {
    header: "Crédit",
    accessorKey: "totalCredit",
    cell: ({ row }: any) => `${(row.original.totalCredit || 0).toLocaleString()}`,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const labels: Record<string, string> = {
        draft: "Brouillon",
        posted: "Validée",
        cancelled: "Annulée",
      };
      return labels[s] || (s || "").toUpperCase();
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "JE-001" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description de l'écriture", colSpan: 2 },
  { name: "totalDebit", label: "Total Débit", type: "number", placeholder: "0", min: 0 },
  { name: "totalCredit", label: "Total Crédit", type: "number", placeholder: "0", min: 0 },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "posted", label: "Validée" },
      { value: "cancelled", label: "Annulée" },
    ],
  },
];

const formSchema = z.object({
  reference: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  description: z.string().optional(),
  totalDebit: z.number().default(0),
  totalCredit: z.number().default(0),
  status: z.string().default("draft"),
});

const JournalEntryPage = createFullEntityPage({
  key: "journal-entry",
  title: "Écritures comptables",
  singular: "Écriture",
  endpoint: "/journal-entry",
  service: "stock",
  permissionPrefix: "journal_entry",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    reference: "",
    date: "",
    description: "",
    totalDebit: 0,
    totalCredit: 0,
    status: "draft",
  },
});

export default JournalEntryPage;
