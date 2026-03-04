import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  { header: "Email", accessorKey: "email" },
  { header: "Téléphone", accessorKey: "phone" },
  { header: "Pays", accessorKey: "country" },
  {
    header: "Note",
    accessorKey: "rating",
    cell: ({ row }: any) => (row.original.rating ? `${row.original.rating}/5` : "—"),
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) => (row.original.isActive !== false ? "✓ Oui" : "✗ Non"),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du fournisseur", required: true },
  { name: "code", label: "Code", type: "text", placeholder: "Ex: FRN-001" },
  { name: "email", label: "Email", type: "email", placeholder: "email@exemple.com" },
  { name: "phone", label: "Téléphone", type: "text", placeholder: "+243 ..." },
  { name: "country", label: "Pays", type: "text", placeholder: "Pays" },
  { name: "rating", label: "Note", type: "number", placeholder: "0", min: 0, max: 5 },
  { name: "website", label: "Site web", type: "text", placeholder: "https://..." },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce fournisseur est-il actif ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  country: z.string().optional(),
  rating: z.number().min(0).max(5).optional().or(z.literal("")),
  website: z.string().optional(),
  isActive: z.boolean().default(true),
});

const SupplierPage = createFullEntityPage({
  key: "supplier",
  title: "Fournisseurs",
  singular: "Fournisseur",
  endpoint: "/supplier",
  service: "stock",
  permissionPrefix: "supplier",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    code: "",
    email: "",
    phone: "",
    country: "",
    rating: "",
    website: "",
    isActive: true,
  },
});

export default SupplierPage;
