import { createListPage } from "@/core/crud/createModule";
import { SlidersHorizontal } from "lucide-react";

const AttributePage = createListPage({
  key: "attribute",
  label: "Attributes",
  endpoint: "/attribute",
  service: "product",
  permissionPrefix: "attribute",
  icon: SlidersHorizontal,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    { header: "Type", accessorKey: "type" },
    { header: "Filterable", accessorKey: "isFilterable", cell: ({ row }: any) => row.original.isFilterable ? "Yes" : "No" },
    { header: "Variant", accessorKey: "isVariant", cell: ({ row }: any) => row.original.isVariant ? "Yes" : "No" },
  ],
});

export default AttributePage;
