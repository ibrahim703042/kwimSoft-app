import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  {
    header: "Contact",
    accessorKey: "contact",
    cell: ({ row }: any) => row.original.contact?.name || row.original.contact || "—",
  },
  {
    header: "Valeur",
    accessorKey: "expectedRevenue",
    cell: ({ row }: any) => row.original.expectedRevenue ?? "—",
  },
  {
    header: "Probabilité %",
    accessorKey: "probability",
    cell: ({ row }: any) =>
      row.original.probability != null ? `${row.original.probability}%` : "—",
  },
  { header: "Date de clôture", accessorKey: "expectedCloseDate" },
  {
    header: "Étape",
    accessorKey: "stage",
    cell: ({ row }: any) => {
      const s = row.original.stage;
      const labels: Record<string, string> = {
        prospecting: "Prospection",
        qualification: "Qualification",
        proposal: "Proposition",
        negotiation: "Négociation",
        closed_won: "Gagné",
        closed_lost: "Perdu",
      };
      return labels[s] || (s || "—");
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'opportunité", required: true },
  { name: "contact", label: "Contact (ID)", type: "text", placeholder: "ID du contact" },
  { name: "expectedRevenue", label: "Revenu attendu", type: "number", placeholder: "0", min: 0 },
  { name: "probability", label: "Probabilité (%)", type: "number", placeholder: "0", min: 0, max: 100 },
  { name: "expectedCloseDate", label: "Date de clôture prévue", type: "date" },
  {
    name: "stage",
    label: "Étape",
    type: "select",
    placeholder: "Sélectionner l'étape",
    options: [
      { value: "prospecting", label: "Prospection" },
      { value: "qualification", label: "Qualification" },
      { value: "proposal", label: "Proposition" },
      { value: "negotiation", label: "Négociation" },
      { value: "closed_won", label: "Gagné" },
      { value: "closed_lost", label: "Perdu" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes...", colSpan: 2 },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  contact: z.string().optional(),
  expectedRevenue: z.number().min(0).optional().or(z.literal("")),
  probability: z.number().min(0).max(100).optional().or(z.literal("")),
  expectedCloseDate: z.string().optional(),
  stage: z.string().optional(),
  notes: z.string().optional(),
});

const OpportunityPage = createFullEntityPage({
  key: "opportunity",
  title: "Opportunités",
  singular: "Opportunité",
  endpoint: "/opportunity",
  service: "hr",
  permissionPrefix: "opportunity",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    contact: "",
    expectedRevenue: "",
    probability: "",
    expectedCloseDate: "",
    stage: "prospecting",
    notes: "",
  },
});

export default OpportunityPage;
