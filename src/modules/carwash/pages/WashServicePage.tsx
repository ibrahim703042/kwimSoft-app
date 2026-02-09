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
        basic: "Basique",
        standard: "Standard",
        premium: "Premium",
        deluxe: "Deluxe",
      };
      return labels[t] || (t || "—");
    },
  },
  {
    header: "Prix",
    accessorKey: "price",
    cell: ({ row }: any) =>
      `${row.original.price ?? 0} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Durée (min)",
    accessorKey: "estimatedDurationMinutes",
    cell: ({ row }: any) =>
      row.original.estimatedDurationMinutes != null
        ? `${row.original.estimatedDurationMinutes} min`
        : "—",
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) =>
      row.original.isActive ? "Oui" : "Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "code", label: "Code", type: "text", placeholder: "Ex: SRV-001", required: true },
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du service", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "basic", label: "Basique" },
      { value: "standard", label: "Standard" },
      { value: "premium", label: "Premium" },
      { value: "deluxe", label: "Deluxe" },
    ],
  },
  { name: "price", label: "Prix", type: "number", placeholder: "0", min: 0, required: true },
  {
    name: "currency",
    label: "Devise",
    type: "select",
    placeholder: "Sélectionner la devise",
    options: [
      { value: "CDF", label: "CDF" },
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
  { name: "estimatedDurationMinutes", label: "Durée estimée (min)", type: "number", placeholder: "30", min: 0 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce service est-il actif ?" },
];

const formSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().optional(),
  price: z.number().min(0, "Le prix est requis"),
  currency: z.string().optional(),
  estimatedDurationMinutes: z.number().min(0).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

const WashServicePage = createFullEntityPage({
  key: "wash-service",
  title: "Services de lavage",
  singular: "Service",
  endpoint: "/wash-service",
  service: "transport",
  permissionPrefix: "wash_service",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    code: "",
    name: "",
    type: "",
    price: "",
    currency: "CDF",
    estimatedDurationMinutes: "",
    isActive: true,
  },
});

export default WashServicePage;
