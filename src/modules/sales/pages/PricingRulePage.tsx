import { createListPage } from "@/core/crud/createModule";
import { Percent } from "lucide-react";

const PricingRulePage = createListPage({
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
});

export default PricingRulePage;
