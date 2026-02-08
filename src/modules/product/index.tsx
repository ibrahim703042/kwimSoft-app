import { createGroupedModule } from "@/core/crud/createModule";
import { Package } from "lucide-react";

export const productModule = createGroupedModule({
  name: "product",
  label: "Products",
  icon: Package,
  basePath: "/products",
  permission: "product.read",
  entities: [
    {
      key: "category",
      label: "Categories",
      endpoint: "/category",
      service: "product",
      permissionPrefix: "category",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Slug", accessorKey: "slug" },
        { header: "Description", accessorKey: "description", cell: ({ row }: any) => (row.original.description || "").slice(0, 60) + ((row.original.description?.length > 60) ? "..." : "") },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "sub-category",
      label: "Sub Categories",
      endpoint: "/sub-category",
      service: "product",
      permissionPrefix: "sub_category",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Slug", accessorKey: "slug" },
        { header: "Description", accessorKey: "description", cell: ({ row }: any) => (row.original.description || "").slice(0, 60) },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "brand",
      label: "Brands",
      endpoint: "/brand",
      service: "product",
      permissionPrefix: "brand",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Slug", accessorKey: "slug" },
        { header: "Website", accessorKey: "website" },
        { header: "Featured", accessorKey: "isFeatured", cell: ({ row }: any) => row.original.isFeatured ? "⭐ Yes" : "No" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "product",
      label: "Products",
      endpoint: "/product",
      service: "product",
      permissionPrefix: "product",
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
    },
    {
      key: "attribute",
      label: "Attributes",
      endpoint: "/attribute",
      service: "product",
      permissionPrefix: "attribute",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Code", accessorKey: "code" },
        { header: "Type", accessorKey: "type" },
        { header: "Filterable", accessorKey: "isFilterable", cell: ({ row }: any) => row.original.isFilterable ? "Yes" : "No" },
        { header: "Variant", accessorKey: "isVariant", cell: ({ row }: any) => row.original.isVariant ? "Yes" : "No" },
      ],
    },
    {
      key: "product-tag",
      label: "Tags",
      endpoint: "/product-tag",
      service: "product",
      permissionPrefix: "product_tag",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Slug", accessorKey: "slug" },
        { header: "Type", accessorKey: "type" },
        { header: "Color", accessorKey: "color" },
      ],
    },
    {
      key: "product-bundle",
      label: "Bundles",
      endpoint: "/product-bundle",
      service: "product",
      permissionPrefix: "product_bundle",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "SKU", accessorKey: "sku" },
        { header: "Price", accessorKey: "price", cell: ({ row }: any) => `${row.original.price || 0}` },
        { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || 0 },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "product-price",
      label: "Pricing",
      endpoint: "/product-price",
      service: "product",
      permissionPrefix: "product_price",
      columns: [
        { header: "Type", accessorKey: "type" },
        { header: "Amount", accessorKey: "amount" },
        { header: "Currency", accessorKey: "currency" },
        { header: "Valid From", accessorKey: "validFrom", cell: ({ row }: any) => row.original.validFrom ? new Date(row.original.validFrom).toLocaleDateString() : "—" },
        { header: "Valid To", accessorKey: "validTo", cell: ({ row }: any) => row.original.validTo ? new Date(row.original.validTo).toLocaleDateString() : "—" },
      ],
    },
    {
      key: "product-review",
      label: "Reviews",
      endpoint: "/product-review",
      service: "product",
      permissionPrefix: "product_review",
      columns: [
        { header: "Customer", accessorKey: "customerName" },
        { header: "Rating", accessorKey: "rating", cell: ({ row }: any) => "⭐".repeat(row.original.rating || 0) },
        { header: "Title", accessorKey: "title" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
        { header: "Date", accessorKey: "createdAt", cell: ({ row }: any) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "—" },
      ],
    },
  ],
});
