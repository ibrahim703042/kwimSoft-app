import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  { header: "Type", accessorKey: "type" },
  {
    header: "Filtrable",
    accessorKey: "isFilterable",
    cell: ({ row }: any) =>
      row.original.isFilterable ? "✓ Oui" : "✗ Non",
  },
  {
    header: "Variant",
    accessorKey: "isVariant",
    cell: ({ row }: any) =>
      row.original.isVariant ? "✓ Oui" : "✗ Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'attribut", required: true },
  { name: "code", label: "Code", type: "text", placeholder: "Ex: color, size" },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "text", label: "Texte" },
      { value: "number", label: "Nombre" },
      { value: "color", label: "Couleur" },
      { value: "size", label: "Taille" },
    ],
  },
  { name: "isFilterable", label: "Filtrable", type: "checkbox", description: "Cet attribut peut être utilisé comme filtre" },
  { name: "isVariant", label: "Variant", type: "checkbox", description: "Cet attribut définit une variante" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().optional(),
  type: z.string().optional(),
  isFilterable: z.boolean().default(false),
  isVariant: z.boolean().default(false),
});

const AttributePage = createFullEntityPage({
  key: "attribute",
  title: "Attributs",
  singular: "Attribut",
  endpoint: "/attribute",
  service: "product",
  permissionPrefix: "attribute",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", code: "", type: "", isFilterable: false, isVariant: false },
});

export default AttributePage;
