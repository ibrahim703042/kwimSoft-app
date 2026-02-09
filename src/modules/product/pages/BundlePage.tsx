import { createListPage } from "@/core/crud/createModule";
import { PackagePlus } from "lucide-react";

const BundlePage = createListPage({
  key: "product-bundle",
  label: "Bundles",
  endpoint: "/product-bundle",
  service: "product",
  permissionPrefix: "product_bundle",
  icon: PackagePlus,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "SKU", accessorKey: "sku" },
    { header: "Price", accessorKey: "price", cell: ({ row }: any) => `${row.original.price || 0}` },
    { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || 0 },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default BundlePage;
