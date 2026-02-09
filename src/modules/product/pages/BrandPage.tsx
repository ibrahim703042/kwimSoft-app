import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
  { header: "Site web", accessorKey: "website" },
  {
    header: "En vedette",
    accessorKey: "isFeatured",
    cell: ({ row }: any) =>
      row.original.isFeatured ? "✓ Oui" : "✗ Non",
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) =>
      row.original.isActive !== false ? "✓ Oui" : "✗ Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la marque", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "slug-marque" },
  { name: "website", label: "Site web", type: "text", placeholder: "https://example.com" },
  { name: "isFeatured", label: "En vedette", type: "checkbox", description: "Marquer comme marque en vedette" },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette marque est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  website: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const BrandPage = createFullEntityPage({
  key: "brand",
  title: "Marques",
  singular: "Marque",
  endpoint: "/brand",
  service: "product",
  permissionPrefix: "brand",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", slug: "", website: "", isFeatured: false, isActive: true },
});

export default BrandPage;
