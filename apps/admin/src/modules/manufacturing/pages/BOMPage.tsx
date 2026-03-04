import { z } from "zod";
import { createFullEntityPage, RelationalField, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Référence", accessorKey: "reference" },
  { header: "Nom", accessorKey: "name" },
  {
    header: "Produit",
    accessorKey: "product",
    cell: ({ row }: any) => row.original.product?.name || row.original.product || "—",
  },
  {
    header: "Quantité",
    accessorKey: "quantity",
    cell: ({ row }: any) => `${row.original.quantity ?? 0} ${row.original.uom || "Unit(s)"}`,
  },
  {
    header: "Type",
    accessorKey: "bomType",
    cell: ({ row }: any) => {
      const t = row.original.bomType;
      const labels: Record<string, string> = {
        manufacture: "Fabrication",
        kit: "Kit",
        subcontracting: "Sous-traitance",
      };
      return labels[t] || t || "—";
    },
  },
  {
    header: "Composants",
    accessorKey: "componentCount",
    cell: ({ row }: any) => row.original.components?.length || 0,
  },
  {
    header: "Actif",
    accessorKey: "isActive",
    cell: ({ row }: any) => (row.original.isActive !== false ? "✓" : "✗"),
  },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "BOM-001" },
  { name: "name", label: "Nom", type: "text", placeholder: "Nomenclature produit A", required: true },
  {
    name: "product", label: "Produit", type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form} name="product" label="Produit"
        service="product" endpoint="/product"
        displayField="name" secondaryField="internalRef"
        placeholder="Sélectionner produit..."
      />
    ),
  },
  { name: "quantity", label: "Quantité", type: "number", placeholder: "1", min: 0 },
  {
    name: "uom", label: "Unité de mesure", type: "select",
    options: [
      { value: "Unit(s)", label: "Unit(s)" },
      { value: "Kg", label: "Kg" },
      { value: "L", label: "L" },
      { value: "Pcs", label: "Pcs" },
    ],
  },
  {
    name: "bomType", label: "Type", type: "select",
    options: [
      { value: "manufacture", label: "Fabrication" },
      { value: "kit", label: "Kit" },
      { value: "subcontracting", label: "Sous-traitance" },
    ],
  },
  { name: "isActive", label: "Actif", type: "checkbox" },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes sur la nomenclature...", colSpan: 2 },
];

const formSchema = z.object({
  reference: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  product: z.string().optional(),
  quantity: z.number().min(0).optional().or(z.literal("")),
  uom: z.string().optional(),
  bomType: z.string().optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

const BOMPage = createFullEntityPage({
  key: "bom",
  title: "Nomenclatures (BOM)",
  singular: "Nomenclature",
  endpoint: "/bom",
  service: "stock",
  permissionPrefix: "bom",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    reference: "",
    name: "",
    product: "",
    quantity: 1,
    uom: "Unit(s)",
    bomType: "manufacture",
    isActive: true,
    notes: "",
  },
});

export default BOMPage;
