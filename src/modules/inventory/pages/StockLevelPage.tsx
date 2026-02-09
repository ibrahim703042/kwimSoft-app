import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Product", accessorKey: "product", cell: ({ row }: any) => row.original.product?.name || "—" },
  { header: "Warehouse", accessorKey: "warehouse", cell: ({ row }: any) => row.original.warehouse?.name || "—" },
  { header: "Quantity", accessorKey: "quantity" },
  { header: "Reserved", accessorKey: "reservedQuantity" },
  { header: "Available", accessorKey: "availableQuantity" },
];

const formFields: FieldConfig[] = [
  { name: "product", label: "Produit (ID)", type: "text", placeholder: "ID du produit", required: true },
  { name: "warehouse", label: "Entrepôt (ID)", type: "text", placeholder: "ID de l'entrepôt", required: true },
  { name: "quantity", label: "Quantité", type: "number", min: 0, required: true },
  { name: "reservedQuantity", label: "Réservé", type: "number", min: 0 },
];

const formSchema = z.object({
  product: z.string().min(1, "Le produit est requis"),
  warehouse: z.string().min(1, "L'entrepôt est requis"),
  quantity: z.number().min(0, "La quantité doit être positive"),
  reservedQuantity: z.number().min(0).default(0),
});

const StockLevelPage = createFullEntityPage({
  key: "stock",
  title: "Niveaux de Stock",
  singular: "Stock",
  endpoint: "/stock",
  service: "stock",
  permissionPrefix: "stock",
  columns,
  formFields,
  formSchema,
  defaultValues: { product: "", warehouse: "", quantity: 0, reservedQuantity: 0 },
});

export default StockLevelPage;
