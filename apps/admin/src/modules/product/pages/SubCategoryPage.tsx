import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { RelationalField } from "@/core/crud/RelationalField";
import { ImageUploadField } from "@/core/crud/ImageUploadField";

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
    header: "Catégorie",
    accessorKey: "category",
    cell: ({ row }: any) => {
      const cat = row.original.category;
      return typeof cat === "object" ? cat?.name : cat || "—";
    },
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
  {
    name: "category",
    label: "Catégorie parente",
    type: "custom",
    render: (form) => (
      <RelationalField
        form={form}
        name="category"
        label="Catégorie parente"
        service="product"
        endpoint="/category"
        displayField="name"
        placeholder="Chercher catégorie..."
        createFields={[
          { name: "name", label: "Nom", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text" },
        ]}
        createSchema={z.object({
          name: z.string().min(1),
          slug: z.string().optional(),
        })}
      />
    ),
  },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description de la sous-catégorie", colSpan: 2 },
  {
    name: "image",
    label: "Image",
    type: "custom",
    colSpan: 2,
    render: (form) => <ImageUploadField form={form} name="image" label="Image" />,
  },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Cette sous-catégorie est-elle active ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
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
  defaultValues: { name: "", slug: "", category: "", description: "", image: "", isActive: true },
});

export default SubCategoryPage;
