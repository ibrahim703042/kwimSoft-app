import { createListPage } from "@/core/crud/createModule";
import { BookOpen } from "lucide-react";

const JournalEntryPage = createListPage({
  key: "journal-entry",
  label: "Journal Entries",
  endpoint: "/journal-entry",
  service: "stock",
  permissionPrefix: "journal_entry",
  icon: BookOpen,
  columns: [
    { header: "Reference", accessorKey: "reference" },
    { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
    { header: "Description", accessorKey: "description", cell: ({ row }: any) => (row.original.description || "").slice(0, 50) },
    { header: "Debit", accessorKey: "totalDebit" },
    { header: "Credit", accessorKey: "totalCredit" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
  ],
});

export default JournalEntryPage;
