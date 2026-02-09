import { createListPage } from "@/core/crud/createModule";
import { Award } from "lucide-react";

const BrandPage = createListPage({
  key: "brand",
  label: "Brands",
  endpoint: "/brand",
  service: "product",
  permissionPrefix: "brand",
  icon: Award,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Slug", accessorKey: "slug" },
    { header: "Website", accessorKey: "website" },
    { header: "Featured", accessorKey: "isFeatured", cell: ({ row }: any) => row.original.isFeatured ? "⭐ Yes" : "No" },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default BrandPage;
