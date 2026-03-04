import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "SKU", accessorKey: "sku" },
  {
    header: "Prix",
    accessorKey: "price",
    cell: ({ row }: any) =>
      row.original.price != null ? `${row.original.price} CDF` : "—",
  },
  {
    header: "Articles",
    accessorKey: "items",
    cell: ({ row }: any) =>
      Array.isArray(row.original.items)
        ? row.original.items.length
        : row.original.itemsCount ?? 0,
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) =>
      row.original.isActive !== false ? "✓ Oui" : "✗ Non",
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du lot", required: true },
  { name: "sku", label: "SKU", type: "text", placeholder: "Ex: BDL-001" },
  { name: "price", label: "Prix", type: "number", placeholder: "0", min: 0 },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce lot est-il actif ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  sku: z.string().optional(),
  price: z.number().min(0).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

const BundlePage = createFullEntityPage({
  key: "product-bundle",
  title: "Lots",
  singular: "Lot",
  endpoint: "/product-bundle",
  service: "product",
  permissionPrefix: "product_bundle",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", sku: "", price: "", isActive: true },
});

export default BundlePage;
