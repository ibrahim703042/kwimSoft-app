import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "SKU", accessorKey: "sku" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const t = row.original.type;
      const colors: Record<string, string> = {
        physical: "text-blue-600",
        digital: "text-purple-600",
        service: "text-amber-600",
      };
      return (
        <span className={`font-medium ${colors[t] || ""}`}>
          {(t || "—").toUpperCase()}
        </span>
      );
    },
  },
  {
    header: "Prix",
    accessorKey: "price",
    cell: ({ row }: any) =>
      `${row.original.price ?? 0} ${row.original.currency || "CDF"}`,
  },
  { header: "Stock", accessorKey: "stockQuantity" },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        active: "text-green-600",
        draft: "text-gray-500",
        archived: "text-red-600",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {(s || "—").toUpperCase()}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du produit", required: true },
  { name: "sku", label: "SKU", type: "text", placeholder: "Ex: PRD-001", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "physical", label: "Physique" },
      { value: "digital", label: "Numérique" },
      { value: "service", label: "Service" },
    ],
  },
  { name: "price", label: "Prix", type: "number", placeholder: "0", min: 0 },
  {
    name: "currency",
    label: "Devise",
    type: "select",
    placeholder: "Sélectionner la devise",
    options: [
      { value: "CDF", label: "CDF" },
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
  { name: "stockQuantity", label: "Quantité en stock", type: "number", placeholder: "0", min: 0 },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description du produit", colSpan: 2 },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "active", label: "Actif" },
      { value: "draft", label: "Brouillon" },
      { value: "archived", label: "Archivé" },
    ],
  },
  { name: "isActive", label: "Actif", type: "checkbox", description: "Ce produit est-il actif ?" },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  sku: z.string().min(1, "Le SKU est requis"),
  type: z.string().optional(),
  price: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  stockQuantity: z.number().min(0).optional().or(z.literal("")),
  description: z.string().optional(),
  status: z.string().optional(),
  isActive: z.boolean().default(true),
});

const ProductListPage = createFullEntityPage({
  key: "product",
  title: "Produits",
  singular: "Produit",
  endpoint: "/product",
  service: "product",
  permissionPrefix: "product",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    sku: "",
    type: "",
    price: "",
    currency: "CDF",
    stockQuantity: "",
    description: "",
    status: "draft",
    isActive: true,
  },
});

export default ProductListPage;
