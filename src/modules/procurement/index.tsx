import { createGroupedModule } from "@/core/crud/createModule";
import { ShoppingCart, Truck, FileQuestion, PackageCheck } from "lucide-react";

export const procurementModule = createGroupedModule({
  name: "procurement",
  label: "Procurement",
  icon: ShoppingCart,
  basePath: "/procurement",
  permission: "supplier.read",
  entities: [
    {
      key: "supplier",
      label: "Suppliers",
      endpoint: "/supplier",
      service: "stock",
      permissionPrefix: "supplier",
      icon: Truck,
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Code", accessorKey: "code" },
        { header: "Email", accessorKey: "email" },
        { header: "Phone", accessorKey: "phone" },
        { header: "Country", accessorKey: "country" },
        { header: "Rating", accessorKey: "rating", cell: ({ row }: any) => row.original.rating ? `${row.original.rating}/5` : "—" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
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
    },
    {
      key: "rfq",
      label: "RFQ",
      endpoint: "/rfq",
      service: "stock",
      permissionPrefix: "rfq",
      icon: FileQuestion,
      columns: [
        { header: "RFQ #", accessorKey: "rfqNumber" },
        { header: "Title", accessorKey: "title" },
        { header: "Deadline", accessorKey: "deadline", cell: ({ row }: any) => row.original.deadline ? new Date(row.original.deadline).toLocaleDateString() : "—" },
        { header: "Vendors", accessorKey: "vendorCount" },
        { header: "Responses", accessorKey: "responseCount" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
      ],
    },
    {
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
    },
  ],
});
