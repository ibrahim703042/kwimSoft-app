import { createGroupedModule } from "@/core/crud/createModule";
import { DollarSign } from "lucide-react";

export const financeModule = createGroupedModule({
  name: "finance",
  label: "Finance",
  icon: DollarSign,
  basePath: "/finance",
  permission: "account.read",
  entities: [
    {
      key: "account",
      label: "Accounts",
      endpoint: "/account",
      service: "stock",
      permissionPrefix: "account",
      columns: [
        { header: "Code", accessorKey: "code" },
        { header: "Name", accessorKey: "name" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Balance", accessorKey: "balance", cell: ({ row }: any) => `${row.original.balance || 0} ${row.original.currency || "CDF"}` },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "invoice",
      label: "Invoices",
      endpoint: "/invoice",
      service: "stock",
      permissionPrefix: "invoice",
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
    },
    {
      key: "payment",
      label: "Payments",
      endpoint: "/payment",
      service: "stock",
      permissionPrefix: "payment",
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
    },
    {
      key: "budget",
      label: "Budgets",
      endpoint: "/budget",
      service: "stock",
      permissionPrefix: "budget",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Period", accessorKey: "period" },
        { header: "Planned", accessorKey: "plannedAmount", cell: ({ row }: any) => `${row.original.plannedAmount || 0}` },
        { header: "Actual", accessorKey: "actualAmount", cell: ({ row }: any) => `${row.original.actualAmount || 0}` },
        { header: "Remaining", accessorKey: "remainingAmount", cell: ({ row }: any) => `${row.original.remainingAmount || 0}` },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
      ],
    },
    {
      key: "journal-entry",
      label: "Journal Entries",
      endpoint: "/journal-entry",
      service: "stock",
      permissionPrefix: "journal_entry",
      columns: [
        { header: "Reference", accessorKey: "reference" },
        { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
        { header: "Description", accessorKey: "description", cell: ({ row }: any) => (row.original.description || "").slice(0, 50) },
        { header: "Debit", accessorKey: "totalDebit" },
        { header: "Credit", accessorKey: "totalCredit" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
      ],
    },
    {
      key: "tax-config",
      label: "Tax Configuration",
      endpoint: "/tax-config",
      service: "stock",
      permissionPrefix: "tax_config",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Code", accessorKey: "code" },
        { header: "Rate (%)", accessorKey: "rate" },
        { header: "Type", accessorKey: "type" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
  ],
});
