import { createListPage } from "@/core/crud/createModule";
import { FileText } from "lucide-react";

const QuotationPage = createListPage({
  key: "quotation",
  label: "Quotations",
  endpoint: "/quotation",
  service: "stock",
  permissionPrefix: "quotation",
  icon: FileText,
  columns: [
    { header: "Quotation #", accessorKey: "quotationNumber" },
    { header: "Customer", accessorKey: "customer", cell: ({ row }: any) => row.original.customer?.name || "—" },
    { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
    { header: "Valid Until", accessorKey: "validUntil", cell: ({ row }: any) => row.original.validUntil ? new Date(row.original.validUntil).toLocaleDateString() : "—" },
    { header: "Total", accessorKey: "totalAmount", cell: ({ row }: any) => `${row.original.totalAmount || 0}` },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { draft: "text-gray-500", sent: "text-blue-600", accepted: "text-green-600", declined: "text-red-600", expired: "text-orange-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
  ],
});

export default QuotationPage;
