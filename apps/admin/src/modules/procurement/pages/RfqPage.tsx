import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "N° RFQ", accessorKey: "rfqNumber" },
  { header: "Titre", accessorKey: "title" },
  {
    header: "Date limite",
    accessorKey: "deadline",
    cell: ({ row }: any) =>
      row.original.deadline
        ? new Date(row.original.deadline).toLocaleDateString()
        : "—",
  },
  { header: "Fournisseurs", accessorKey: "vendorCount" },
  { header: "Réponses", accessorKey: "responseCount" },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) =>
      (row.original.status || "—").replace(/_/g, " ").toUpperCase(),
  },
];

const formFields: FieldConfig[] = [
  { name: "rfqNumber", label: "N° RFQ", type: "text", placeholder: "RFQ-001" },
  { name: "title", label: "Titre", type: "text", placeholder: "Titre de la demande", required: true },
  { name: "deadline", label: "Date limite", type: "date" },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "sent", label: "Envoyé" },
      { value: "closed", label: "Clôturé" },
      { value: "cancelled", label: "Annulé" },
    ],
  },
  { name: "description", label: "Description", type: "textarea", placeholder: "Détails de la demande de prix...", colSpan: 2 },
];

const formSchema = z.object({
  rfqNumber: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  deadline: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

const RfqPage = createFullEntityPage({
  key: "rfq",
  title: "Demandes de prix",
  singular: "Demande de prix",
  endpoint: "/rfq",
  service: "stock",
  permissionPrefix: "rfq",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    rfqNumber: "",
    title: "",
    deadline: "",
    description: "",
    status: "draft",
  },
});

export default RfqPage;
