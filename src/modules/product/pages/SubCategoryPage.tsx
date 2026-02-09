import { createListPage } from "@/core/crud/createModule";
import { Layers } from "lucide-react";

const SubCategoryPage = createListPage({
  key: "sub-category",
  label: "Sub Categories",
  endpoint: "/sub-category",
  service: "product",
  permissionPrefix: "sub_category",
  icon: Layers,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Slug", accessorKey: "slug" },
    { header: "Description", accessorKey: "description", cell: ({ row }: any) => (row.original.description || "").slice(0, 60) },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default SubCategoryPage;
