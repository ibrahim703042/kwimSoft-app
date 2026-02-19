import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  {
    header: "Contact",
    accessorKey: "contact",
    cell: ({ row }: any) => row.original.contact?.name || row.original.contact || "—",
  },
  { header: "Source", accessorKey: "source" },
  {
    header: "Valeur",
    accessorKey: "estimatedValue",
    cell: ({ row }: any) => row.original.estimatedValue ?? "—",
  },
  {
    header: "Étape",
    accessorKey: "stage",
    cell: ({ row }: any) => {
      const s = row.original.stage;
      const labels: Record<string, string> = {
        new: "Nouveau",
        qualified: "Qualifié",
        proposal: "Proposition",
        negotiation: "Négociation",
        closed_won: "Gagné",
        closed_lost: "Perdu",
      };
      return labels[s] || (s || "—");
    },
  },
  { header: "Statut", accessorKey: "status" },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du prospect", required: true },
  { name: "contact", label: "Contact (ID)", type: "text", placeholder: "ID du contact" },
  {
    name: "source",
    label: "Source",
    type: "select",
    placeholder: "Sélectionner la source",
    options: [
      { value: "website", label: "Site web" },
      { value: "referral", label: "Référence" },
      { value: "cold_call", label: "Appel à froid" },
      { value: "social_media", label: "Réseaux sociaux" },
      { value: "other", label: "Autre" },
    ],
  },
  { name: "estimatedValue", label: "Valeur estimée", type: "number", placeholder: "0", min: 0 },
  {
    name: "stage",
    label: "Étape",
    type: "select",
    placeholder: "Sélectionner l'étape",
    options: [
      { value: "new", label: "Nouveau" },
      { value: "qualified", label: "Qualifié" },
      { value: "proposal", label: "Proposition" },
      { value: "negotiation", label: "Négociation" },
      { value: "closed_won", label: "Gagné" },
      { value: "closed_lost", label: "Perdu" },
    ],
  },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "active", label: "Actif" },
      { value: "inactive", label: "Inactif" },
      { value: "converted", label: "Converti" },
    ],
  },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  contact: z.string().optional(),
  source: z.string().optional(),
  estimatedValue: z.number().min(0).optional().or(z.literal("")),
  stage: z.string().optional(),
  status: z.string().optional(),
});

const LeadPage = createFullEntityPage({
  key: "lead",
  title: "Prospects",
  singular: "Prospect",
  endpoint: "/lead",
  service: "hr",
  permissionPrefix: "lead",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    contact: "",
    source: "",
    estimatedValue: "",
    stage: "new",
    status: "active",
  },
});

export default LeadPage;
