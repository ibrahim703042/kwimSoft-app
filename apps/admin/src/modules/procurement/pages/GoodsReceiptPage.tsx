import { z } from "zod";
import { createFullEntityPage, RelationalField, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Référence", accessorKey: "reference" },
  {
    header: "Bon de commande",
    accessorKey: "purchaseOrder",
    cell: ({ row }: any) => row.original.purchaseOrder?.orderNumber || "—",
  },
  {
    header: "Fournisseur",
    accessorKey: "supplier",
    cell: ({ row }: any) => row.original.supplier?.name || "—",
  },
  {
    header: "Date",
    accessorKey: "receiptDate",
    cell: ({ row }: any) =>
      row.original.receiptDate
        ? new Date(row.original.receiptDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Articles",
    accessorKey: "items",
    cell: ({ row }: any) => row.original.items?.length || 0,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => (row.original.status || "—").toUpperCase(),
  },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "GR-001" },
  {
    name: "purchaseOrder",
    label: "Bon de commande",
    type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form}
        name="purchaseOrder"
        label="Bon de commande"
        service="stock"
        endpoint="/purchase-order"
        displayField="orderNumber"
        placeholder="Chercher bon de commande..."
      />
    ),
  },
  { name: "receiptDate", label: "Date de réception", type: "date", required: true },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "pending", label: "En attente" },
      { value: "received", label: "Reçu" },
      { value: "inspected", label: "Inspecté" },
      { value: "rejected", label: "Rejeté" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes sur la réception...", colSpan: 2 },
];

const formSchema = z.object({
  reference: z.string().optional(),
  purchaseOrder: z.string().optional(),
  receiptDate: z.string().min(1, "La date est requise"),
  status: z.string().optional(),
  notes: z.string().optional(),
});

const GoodsReceiptPage = createFullEntityPage({
  key: "goods-receipt",
  title: "Réceptions",
  singular: "Réception",
  endpoint: "/goods-receipt",
  service: "stock",
  permissionPrefix: "goods_receipt",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    reference: "",
    purchaseOrder: "",
    receiptDate: "",
    status: "pending",
    notes: "",
  },
});

export default GoodsReceiptPage;
