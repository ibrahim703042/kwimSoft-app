import { createListPage } from "@/core/crud/createModule";
import { BadgeDollarSign } from "lucide-react";

const PricingPage = createListPage({
  key: "product-price",
  label: "Pricing",
  endpoint: "/product-price",
  service: "product",
  permissionPrefix: "product_price",
  icon: BadgeDollarSign,
  columns: [
    { header: "Type", accessorKey: "type" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Currency", accessorKey: "currency" },
    { header: "Valid From", accessorKey: "validFrom", cell: ({ row }: any) => row.original.validFrom ? new Date(row.original.validFrom).toLocaleDateString() : "—" },
    { header: "Valid To", accessorKey: "validTo", cell: ({ row }: any) => row.original.validTo ? new Date(row.original.validTo).toLocaleDateString() : "—" },
  ],
});

export default PricingPage;
