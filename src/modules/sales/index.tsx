import { createGroupedModule } from "@/core/crud/createModule";
import {
  TrendingUp, UserCheck, ShoppingBag, FileText,
  Users, Percent,
} from "lucide-react";

export const salesModule = createGroupedModule({
  name: "sales",
  label: "Sales",
  icon: TrendingUp,
  basePath: "/sales",
  permission: "customer.read",
  entities: [
    {
      key: "customer",
      label: "Customers",
      endpoint: "/customer",
      service: "stock",
      permissionPrefix: "customer",
      icon: UserCheck,
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Email", accessorKey: "email" },
        { header: "Phone", accessorKey: "phone" },
        { header: "Company", accessorKey: "company" },
        { header: "Total Orders", accessorKey: "totalOrders" },
        { header: "Total Spent", accessorKey: "totalSpent", cell: ({ row }: any) => `${row.original.totalSpent || 0}` },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
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
    },
    {
      key: "quotation",
      label: "Quotations",
      endpoint: "/quotation",
      service: "stock",
      permissionPrefix: "quotation",
      icon: FileText,
      columns: [
        { header: "Quotation #", accessorKey: "quotationNumber" },
        { header: "Customer", accessorKey: "customer", cell: ({ row }: any) => row.original.customer?.name || "—" },
        { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
        { header: "Valid Until", accessorKey: "validUntil", cell: ({ row }: any) => row.original.validUntil ? new Date(row.original.validUntil).toLocaleDateString() : "—" },
        { header: "Total", accessorKey: "totalAmount", cell: ({ row }: any) => `${row.original.totalAmount || 0}` },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { draft: "text-gray-500", sent: "text-blue-600", accepted: "text-green-600", declined: "text-red-600", expired: "text-orange-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
    {
      key: "sales-team",
      label: "Sales Teams",
      endpoint: "/sales-team",
      service: "stock",
      permissionPrefix: "sales_team",
      icon: Users,
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Leader", accessorKey: "leader", cell: ({ row }: any) => row.original.leader?.name || "—" },
        { header: "Members", accessorKey: "memberCount" },
        { header: "Target", accessorKey: "salesTarget", cell: ({ row }: any) => `${row.original.salesTarget || 0}` },
        { header: "Achieved", accessorKey: "salesAchieved", cell: ({ row }: any) => `${row.original.salesAchieved || 0}` },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "pricing-rule",
      label: "Pricing Rules",
      endpoint: "/pricing-rule",
      service: "stock",
      permissionPrefix: "pricing_rule",
      icon: Percent,
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Type", accessorKey: "type" },
        { header: "Discount %", accessorKey: "discountPercentage" },
        { header: "Min Qty", accessorKey: "minQuantity" },
        { header: "Valid From", accessorKey: "validFrom", cell: ({ row }: any) => row.original.validFrom ? new Date(row.original.validFrom).toLocaleDateString() : "—" },
        { header: "Valid To", accessorKey: "validTo", cell: ({ row }: any) => row.original.validTo ? new Date(row.original.validTo).toLocaleDateString() : "—" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
  ],
});
