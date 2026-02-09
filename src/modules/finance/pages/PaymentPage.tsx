import { createListPage } from "@/core/crud/createModule";
import { CreditCard } from "lucide-react";

const PaymentPage = createListPage({
  key: "payment",
  label: "Payments",
  endpoint: "/payment",
  service: "stock",
  permissionPrefix: "payment",
  icon: CreditCard,
  columns: [
    { header: "Reference", accessorKey: "reference" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Amount", accessorKey: "amount", cell: ({ row }: any) => `${row.original.amount || 0} ${row.original.currency || "CDF"}` },
    { header: "Method", accessorKey: "method", cell: ({ row }: any) => (row.original.method || "").replace(/_/g, " ").toUpperCase() },
    { header: "Date", accessorKey: "paymentDate", cell: ({ row }: any) => row.original.paymentDate ? new Date(row.original.paymentDate).toLocaleDateString() : "—" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { pending: "text-yellow-600", completed: "text-green-600", failed: "text-red-600", refunded: "text-blue-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
  ],
});

export default PaymentPage;
