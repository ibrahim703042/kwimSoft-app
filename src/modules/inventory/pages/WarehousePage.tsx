import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  { header: "Address", accessorKey: "address", cell: ({ row }: any) => row.original.address?.city || row.original.address || "—" },
  { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'entrepôt", required: true },
  { name: "code", label: "Code", type: "text", placeholder: "Ex: WH-001", required: true },
  { name: "address", label: "Adresse", type: "text", placeholder: "Ville ou adresse complète", colSpan: 2 },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description de l'entrepôt", colSpan: 2 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cet entrepôt est-il actif ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  address: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const WarehousePage = createFullEntityPage({
  key: "warehouse",
  title: "Entrepôts",
  singular: "Entrepôt",
  endpoint: "/warehouse",
  service: "stock",
  permissionPrefix: "warehouse",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", code: "", address: "", description: "", isActive: true },
});

export default WarehousePage;
