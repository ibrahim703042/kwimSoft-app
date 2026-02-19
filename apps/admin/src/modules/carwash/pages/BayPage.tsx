import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Code", accessorKey: "code" },
  { header: "Nom", accessorKey: "name" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const t = row.original.type;
      const labels: Record<string, string> = {
        manual: "Manuel",
        automatic: "Automatique",
        self_service: "Libre-service",
      };
      return labels[t] || (t || "—");
    },
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        available: "text-green-600",
        occupied: "text-blue-600",
        maintenance: "text-amber-600",
        out_of_order: "text-red-600",
      };
      const labels: Record<string, string> = {
        available: "Disponible",
        occupied: "Occupé",
        maintenance: "Maintenance",
        out_of_order: "Hors service",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {labels[s] || (s || "—")}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "code", label: "Code", type: "text", placeholder: "Ex: BAY-001", required: true },
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la baie", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "manual", label: "Manuel" },
      { value: "automatic", label: "Automatique" },
      { value: "self_service", label: "Libre-service" },
    ],
  },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "available", label: "Disponible" },
      { value: "occupied", label: "Occupé" },
      { value: "maintenance", label: "Maintenance" },
      { value: "out_of_order", label: "Hors service" },
    ],
  },
];

const formSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().optional(),
  status: z.string().optional(),
});

const BayPage = createFullEntityPage({
  key: "bay",
  title: "Baies",
  singular: "Baie",
  endpoint: "/bay",
  service: "transport",
  permissionPrefix: "bay",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    code: "",
    name: "",
    type: "",
    status: "available",
  },
});

export default BayPage;
