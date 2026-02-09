import { createListPage } from "@/core/crud/createModule";
import { ShoppingBag } from "lucide-react";

const SalesOrderPage = createListPage({
  key: "order",
  label: "Sales Orders",
  endpoint: "/order",
  service: "stock",
  permissionPrefix: "order",
  icon: ShoppingBag,
  columns: [
    { header: "Order #", accessorKey: "orderNumber" },
    { header: "Customer", accessorKey: "customer", cell: ({ row }: any) => row.original.customer?.name || "—" },
    { header: "Date", accessorKey: "orderDate", cell: ({ row }: any) => row.original.orderDate ? new Date(row.original.orderDate).toLocaleDateString() : "—" },
    { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || row.original.lineCount || 0 },
    { header: "Total", accessorKey: "totalAmount", cell: ({ row }: any) => `${row.original.totalAmount || 0} ${row.original.currency || "CDF"}` },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { draft: "text-gray-500", confirmed: "text-blue-600", shipped: "text-indigo-600", delivered: "text-green-600", cancelled: "text-red-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
  ],
});

export default SalesOrderPage;
