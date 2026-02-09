import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }: any) =>
      (row.original.description || "").slice(0, 60) +
      (row.original.description?.length > 60 ? "..." : ""),
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) =>
      row.original.isActive !== false ? "✓ Oui" : "✗ Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la catégorie", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "slug-de-la-categorie" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description de la catégorie", colSpan: 2 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette catégorie est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const CategoryPage = createFullEntityPage({
  key: "category",
  title: "Catégories",
  singular: "Catégorie",
  endpoint: "/category",
  service: "product",
  permissionPrefix: "category",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", slug: "", description: "", isActive: true },
});

export default CategoryPage;
