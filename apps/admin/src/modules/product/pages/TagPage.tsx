import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
  { header: "Type", accessorKey: "type" },
  {
    header: "Couleur",
    accessorKey: "color",
    cell: ({ row }: any) => {
      const c = row.original.color;
      return c ? (
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-4 w-4 rounded-full border"
            style={{ backgroundColor: c }}
          />
          {c}
        </span>
      ) : (
        "—"
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'étiquette", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "slug-etiquette" },
  { name: "type", label: "Type", type: "text", placeholder: "Type d'étiquette" },
  { name: "color", label: "Couleur", type: "text", placeholder: "#3b82f6" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
});

const TagPage = createFullEntityPage({
  key: "product-tag",
  title: "Étiquettes",
  singular: "Étiquette",
  endpoint: "/product-tag",
  service: "product",
  permissionPrefix: "product_tag",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", slug: "", type: "", color: "" },
});

export default TagPage;
