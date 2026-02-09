import { createListPage } from "@/core/crud/createModule";
import { ShoppingCart } from "lucide-react";

const PurchaseOrderPage = createListPage({
  key: "purchase-order",
  label: "Purchase Orders",
  endpoint: "/purchase-order",
  service: "stock",
  permissionPrefix: "purchase_order",
  icon: ShoppingCart,
  columns: [
    { header: "PO #", accessorKey: "orderNumber" },
    { header: "Supplier", accessorKey: "supplier", cell: ({ row }: any) => row.original.supplier?.name || "—" },
    { header: "Date", accessorKey: "orderDate", cell: ({ row }: any) => row.original.orderDate ? new Date(row.original.orderDate).toLocaleDateString() : "—" },
    { header: "Total", accessorKey: "totalAmount", cell: ({ row }: any) => `${row.original.totalAmount || 0} ${row.original.currency || "CDF"}` },
    { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || 0 },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { draft: "text-gray-500", confirmed: "text-blue-600", received: "text-green-600", cancelled: "text-red-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
  ],
});

export default PurchaseOrderPage;
