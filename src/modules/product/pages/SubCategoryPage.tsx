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
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de la sous-catégorie", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "slug-sous-categorie" },
  { name: "category", label: "Catégorie (ID)", type: "text", placeholder: "ID de la catégorie parente" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description de la sous-catégorie", colSpan: 2 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette sous-catégorie est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const SubCategoryPage = createFullEntityPage({
  key: "sub-category",
  title: "Sous-catégories",
  singular: "Sous-catégorie",
  endpoint: "/sub-category",
  service: "product",
  permissionPrefix: "sub_category",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", slug: "", category: "", description: "", isActive: true },
});

export default SubCategoryPage;
