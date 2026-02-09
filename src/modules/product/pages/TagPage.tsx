import { createListPage } from "@/core/crud/createModule";
import { Tag } from "lucide-react";

const TagPage = createListPage({
  key: "product-tag",
  label: "Tags",
  endpoint: "/product-tag",
  service: "product",
  permissionPrefix: "product_tag",
  icon: Tag,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Slug", accessorKey: "slug" },
    { header: "Type", accessorKey: "type" },
    { header: "Color", accessorKey: "color" },
  ],
});

export default TagPage;
