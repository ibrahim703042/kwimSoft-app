import { createListPage } from "@/core/crud/createModule";
import { ShoppingCart } from "lucide-react";

const WashOrderPage = createListPage({
  key: "wash-order",
  label: "Wash Orders",
  endpoint: "/wash-order",
  service: "transport",
  permissionPrefix: "wash_order",
  icon: ShoppingCart,
  columns: [
    { header: "Order #", accessorKey: "orderNumber" },
    { header: "Vehicle Plate", accessorKey: "vehiclePlateNumber" },
    { header: "Vehicle Type", accessorKey: "vehicleType" },
    { header: "Price", accessorKey: "totalPrice", cell: ({ row }: any) => `${row.original.totalPrice || 0} ${row.original.currency || "CDF"}` },
    { header: "Payment", accessorKey: "paymentStatus", cell: ({ row }: any) => {
      const s = row.original.paymentStatus;
      const colors: Record<string, string> = { paid: "text-green-600", pending: "text-yellow-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { queued: "text-blue-600", in_progress: "text-yellow-600", washing: "text-cyan-600", completed: "text-green-600", cancelled: "text-red-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
    }},
  ],
});

export default WashOrderPage;
