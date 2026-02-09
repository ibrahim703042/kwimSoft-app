import { createGroupedModule } from "@/core/crud/createModule";
import { Droplets, Warehouse, ShoppingCart } from "lucide-react";

export const carwashModule = createGroupedModule({
  name: "carwash",
  label: "Carwash",
  icon: Droplets,
  basePath: "/carwash",
  permission: "wash_service.read",
  entities: [
    {
      key: "wash-service",
      label: "Wash Services",
      endpoint: "/wash-service",
      service: "transport",
      permissionPrefix: "wash_service",
      icon: Droplets,
      columns: [
        { header: "Code", accessorKey: "code" },
        { header: "Name", accessorKey: "name" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Price", accessorKey: "price", cell: ({ row }: any) => `${row.original.price || 0} ${row.original.currency || "CDF"}` },
        { header: "Duration (min)", accessorKey: "estimatedDurationMinutes" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "bay",
      label: "Bays",
      endpoint: "/bay",
      service: "transport",
      permissionPrefix: "bay",
      icon: Warehouse,
      columns: [
        { header: "Code", accessorKey: "code" },
        { header: "Name", accessorKey: "name" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { available: "text-green-600", occupied: "text-yellow-600", maintenance: "text-orange-600", out_of_order: "text-red-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
        }},
      ],
    },
    {
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
    },
  ],
});
