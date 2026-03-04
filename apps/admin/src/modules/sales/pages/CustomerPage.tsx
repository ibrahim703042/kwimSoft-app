import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Téléphone", accessorKey: "phone" },
  { header: "Société", accessorKey: "company" },
  { header: "Total commandes", accessorKey: "totalOrders" },
  {
    header: "Total dépensé",
    accessorKey: "totalSpent",
    cell: ({ row }: any) => `${row.original.totalSpent ?? 0}`,
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) => (row.original.isActive !== false ? "✓ Oui" : "✗ Non"),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du client", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "email@exemple.com" },
  { name: "phone", label: "Téléphone", type: "text", placeholder: "+243 ..." },
  { name: "company", label: "Société", type: "text", placeholder: "Nom de la société" },
  { name: "address", label: "Adresse", type: "textarea", placeholder: "Adresse complète" },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce client est-il actif ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

const CustomerPage = createFullEntityPage({
  key: "customer",
  title: "Clients",
  singular: "Client",
  endpoint: "/customer",
  service: "stock",
  permissionPrefix: "customer",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    isActive: true,
  },
});

export default CustomerPage;
