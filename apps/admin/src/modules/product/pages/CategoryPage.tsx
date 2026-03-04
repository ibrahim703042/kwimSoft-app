import { z } from "zod";
import { createFullEntityPage, ImageUploadField, type FieldConfig } from "@/core/crud";

const columns = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }: any) =>
      row.original.image ? (
        <img src={row.original.image} alt={row.original.name} className="w-10 h-10 rounded object-cover" />
      ) : (
        <div className="w-10 h-10 rounded bg-muted" />
      ),
  },
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
  {
    name: "image",
    label: "Image",
    type: "custom",
    colSpan: 2,
    render: (form) => <ImageUploadField form={form} name="image" label="Image de la catégorie" />,
  },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette catégorie est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
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
  defaultValues: { name: "", slug: "", description: "", image: "", isActive: true },
});

export default CategoryPage;
