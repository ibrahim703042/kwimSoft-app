import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { ImageUploadField } from "@/core/crud/ImageUploadField";

const columns = [
  {
    header: "Logo",
    accessorKey: "logo",
    cell: ({ row }: any) =>
      row.original.logo ? (
        <img src={row.original.logo} alt={row.original.name} className="w-10 h-10 rounded object-contain" />
      ) : (
        <div className="w-10 h-10 rounded bg-muted" />
      ),
  },
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
  {
    name: "logo",
    label: "Logo",
    type: "custom",
    colSpan: 2,
    render: (form) => <ImageUploadField form={form} name="logo" label="Logo de la marque" />,
  },
  { name: "isFeatured", label: "En vedette", type: "checkbox", description: "Marquer comme marque en vedette" },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette marque est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
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
  defaultValues: { name: "", slug: "", website: "", logo: "", isFeatured: false, isActive: true },
});

export default BrandPage;
