import { createListPage } from "@/core/crud/createModule";
import { Calculator } from "lucide-react";

const TaxConfigPage = createListPage({
  key: "tax-config",
  label: "Tax Configuration",
  endpoint: "/tax-config",
  service: "stock",
  permissionPrefix: "tax_config",
  icon: Calculator,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    { header: "Rate (%)", accessorKey: "rate" },
    { header: "Type", accessorKey: "type" },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default TaxConfigPage;
