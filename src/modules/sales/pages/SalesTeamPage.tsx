import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  {
    header: "Responsable",
    accessorKey: "leader",
    cell: ({ row }: any) => row.original.leader?.name || "—",
  },
  { header: "Membres", accessorKey: "memberCount" },
  {
    header: "Objectif",
    accessorKey: "salesTarget",
    cell: ({ row }: any) => `${row.original.salesTarget ?? 0}`,
  },
  {
    header: "Réalisé",
    accessorKey: "salesAchieved",
    cell: ({ row }: any) => `${row.original.salesAchieved ?? 0}`,
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) => (row.original.isActive !== false ? "✓ Oui" : "✗ Non"),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'équipe", required: true },
  { name: "salesTarget", label: "Objectif de vente", type: "number", placeholder: "0", min: 0 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette équipe est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  salesTarget: z.number().min(0).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

const SalesTeamPage = createFullEntityPage({
  key: "sales-team",
  title: "Équipes de vente",
  singular: "Équipe",
  endpoint: "/sales-team",
  service: "stock",
  permissionPrefix: "sales_team",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    salesTarget: "",
    isActive: true,
  },
});

export default SalesTeamPage;
