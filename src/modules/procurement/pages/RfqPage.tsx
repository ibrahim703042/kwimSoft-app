import { createListPage } from "@/core/crud/createModule";
import { FileQuestion } from "lucide-react";

const RfqPage = createListPage({
  key: "rfq",
  label: "RFQ",
  endpoint: "/rfq",
  service: "stock",
  permissionPrefix: "rfq",
  icon: FileQuestion,
  columns: [
    { header: "RFQ #", accessorKey: "rfqNumber" },
    { header: "Title", accessorKey: "title" },
    { header: "Deadline", accessorKey: "deadline", cell: ({ row }: any) => row.original.deadline ? new Date(row.original.deadline).toLocaleDateString() : "—" },
    { header: "Vendors", accessorKey: "vendorCount" },
    { header: "Responses", accessorKey: "responseCount" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
  ],
});

export default RfqPage;
