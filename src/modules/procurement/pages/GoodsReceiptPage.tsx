import { createListPage } from "@/core/crud/createModule";
import { PackageCheck } from "lucide-react";

const GoodsReceiptPage = createListPage({
  key: "goods-receipt",
  label: "Goods Receipts",
  endpoint: "/goods-receipt",
  service: "stock",
  permissionPrefix: "goods_receipt",
  icon: PackageCheck,
  columns: [
    { header: "Reference", accessorKey: "reference" },
    { header: "PO", accessorKey: "purchaseOrder", cell: ({ row }: any) => row.original.purchaseOrder?.orderNumber || "—" },
    { header: "Supplier", accessorKey: "supplier", cell: ({ row }: any) => row.original.supplier?.name || "—" },
    { header: "Date", accessorKey: "receiptDate", cell: ({ row }: any) => row.original.receiptDate ? new Date(row.original.receiptDate).toLocaleDateString() : "—" },
    { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || 0 },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
  ],
});

export default GoodsReceiptPage;
