import { createListPage } from "@/core/crud/createModule";
import { Star } from "lucide-react";

const ReviewPage = createListPage({
  key: "product-review",
  label: "Reviews",
  endpoint: "/product-review",
  service: "product",
  permissionPrefix: "product_review",
  icon: Star,
  columns: [
    { header: "Customer", accessorKey: "customerName" },
    { header: "Rating", accessorKey: "rating", cell: ({ row }: any) => "⭐".repeat(row.original.rating || 0) },
    { header: "Title", accessorKey: "title" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
    { header: "Date", accessorKey: "createdAt", cell: ({ row }: any) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "—" },
  ],
});

export default ReviewPage;
