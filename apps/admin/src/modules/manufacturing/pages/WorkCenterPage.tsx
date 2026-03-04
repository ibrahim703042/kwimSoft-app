import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  {
    header: "Capacité",
    accessorKey: "capacity",
    cell: ({ row }: any) => row.original.capacity || "—",
  },
  {
    header: "Coût/h",
    accessorKey: "costPerHour",
    cell: ({ row }: any) =>
      row.original.costPerHour ? `${row.original.costPerHour} ${row.original.currency || "CDF"}` : "—",
  },
  {
    header: "Efficacité",
    accessorKey: "efficiency",
    cell: ({ row }: any) => row.original.efficiency ? `${row.original.efficiency}%` : "—",
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) => (row.original.isActive !== false ? "✓ Oui" : "✗ Non"),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom du poste", type: "text", placeholder: "Poste de soudure", required: true },
  { name: "code", label: "Code", type: "text", placeholder: "WC-001" },
  { name: "capacity", label: "Capacité (unités/h)", type: "number", placeholder: "0", min: 0 },
  { name: "costPerHour", label: "Coût par heure", type: "number", placeholder: "0.00", min: 0 },
  {
    name: "currency", label: "Devise", type: "select",
    options: [
      { value: "CDF", label: "CDF" },
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
  { name: "efficiency", label: "Efficacité (%)", type: "number", placeholder: "100", min: 0, max: 100 },
  {
    name: "type", label: "Type", type: "select",
    options: [
      { value: "machine", label: "Machine" },
      { value: "manual", label: "Manuel" },
      { value: "assembly", label: "Assemblage" },
      { value: "packaging", label: "Emballage" },
    ],
  },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce poste est-il actif ?" },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Description du poste de travail...", colSpan: 2 },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().optional(),
  capacity: z.number().min(0).optional().or(z.literal("")),
  costPerHour: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  efficiency: z.number().min(0).max(100).optional().or(z.literal("")),
  type: z.string().optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

const WorkCenterPage = createFullEntityPage({
  key: "work-center",
  title: "Postes de travail",
  singular: "Poste de travail",
  endpoint: "/work-center",
  service: "stock",
  permissionPrefix: "work_center",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    code: "",
    capacity: "",
    costPerHour: "",
    currency: "CDF",
    efficiency: 100,
    type: "machine",
    isActive: true,
    notes: "",
  },
});

export default WorkCenterPage;
