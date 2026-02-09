import { createListPage } from "@/core/crud/createModule";
import { FileText } from "lucide-react";

const InvoicePage = createListPage({
  key: "invoice",
  label: "Invoices",
  endpoint: "/invoice",
  service: "stock",
  permissionPrefix: "invoice",
  icon: FileText,
  columns: [
    { header: "Invoice #", accessorKey: "invoiceNumber" },
    { header: "Customer", accessorKey: "customerName" },
    { header: "Date", accessorKey: "invoiceDate", cell: ({ row }: any) => row.original.invoiceDate ? new Date(row.original.invoiceDate).toLocaleDateString() : "—" },
    { header: "Due Date", accessorKey: "dueDate", cell: ({ row }: any) => row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "—" },
    { header: "Total", accessorKey: "totalAmount", cell: ({ row }: any) => `${row.original.totalAmount || 0} ${row.original.currency || "CDF"}` },
    { header: "Paid", accessorKey: "amountPaid", cell: ({ row }: any) => `${row.original.amountPaid || 0}` },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { draft: "text-gray-500", sent: "text-blue-600", paid: "text-green-600", overdue: "text-red-600", cancelled: "text-red-400" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
    }},
  ],
});

export default InvoicePage;
