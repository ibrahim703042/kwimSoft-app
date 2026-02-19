import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Type", accessorKey: "type" },
  { header: "Début", accessorKey: "startDate" },
  { header: "Fin", accessorKey: "endDate" },
  {
    header: "Budget",
    accessorKey: "budget",
    cell: ({ row }: any) => row.original.budget ?? "—",
  },
  { header: "Statut", accessorKey: "status" },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la campagne", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "email", label: "Email" },
      { value: "social", label: "Réseaux sociaux" },
      { value: "event", label: "Événement" },
      { value: "advertising", label: "Publicité" },
      { value: "other", label: "Autre" },
    ],
  },
  { name: "startDate", label: "Date de début", type: "date" },
  { name: "endDate", label: "Date de fin", type: "date" },
  { name: "budget", label: "Budget", type: "number", placeholder: "0", min: 0 },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "active", label: "Actif" },
      { value: "paused", label: "En pause" },
      { value: "completed", label: "Terminé" },
      { value: "cancelled", label: "Annulé" },
    ],
  },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional().or(z.literal("")),
  status: z.string().optional(),
});

const CampaignPage = createFullEntityPage({
  key: "campaign",
  title: "Campagnes",
  singular: "Campagne",
  endpoint: "/campaign",
  service: "hr",
  permissionPrefix: "campaign",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "draft",
  },
});

export default CampaignPage;
