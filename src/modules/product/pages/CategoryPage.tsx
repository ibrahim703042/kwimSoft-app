import { createListPage } from "@/core/crud/createModule";
import { FolderTree } from "lucide-react";

const CategoryPage = createListPage({
  key: "category",
  label: "Categories",
  endpoint: "/category",
  service: "product",
  permissionPrefix: "category",
  icon: FolderTree,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Slug", accessorKey: "slug" },
    { header: "Description", accessorKey: "description", cell: ({ row }: any) => (row.original.description || "").slice(0, 60) + ((row.original.description?.length > 60) ? "..." : "") },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default CategoryPage;
