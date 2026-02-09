import { createListPage } from "@/core/crud/createModule";
import { Box } from "lucide-react";

const ProductListPage = createListPage({
  key: "product",
  label: "Products",
  endpoint: "/product",
  service: "product",
  permissionPrefix: "product",
  icon: Box,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "SKU", accessorKey: "sku" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").toUpperCase() },
    { header: "Price", accessorKey: "price", cell: ({ row }: any) => `${row.original.price || 0} ${row.original.currency || "CDF"}` },
    { header: "Stock", accessorKey: "stockQuantity" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { active: "text-green-600", draft: "text-gray-500", archived: "text-red-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
  ],
});

export default ProductListPage;
