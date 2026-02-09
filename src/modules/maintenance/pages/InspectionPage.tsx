import { createListPage } from "@/core/crud/createModule";
import { ClipboardCheck } from "lucide-react";

const InspectionPage = createListPage({
  key: "inspection",
  label: "Inspections",
  endpoint: "/inspection",
  service: "transport",
  permissionPrefix: "inspection",
  icon: ClipboardCheck,
  columns: [
    { header: "Inspection #", accessorKey: "inspectionNumber" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Inspector", accessorKey: "inspectorName" },
    { header: "Date", accessorKey: "inspectionDate", cell: ({ row }: any) => row.original.inspectionDate ? new Date(row.original.inspectionDate).toLocaleDateString() : "—" },
    { header: "Score", accessorKey: "overallScore", cell: ({ row }: any) => {
      const score = row.original.overallScore;
      if (score == null) return "—";
      const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
      return <span className={`font-bold ${color}`}>{score}/100</span>;
    }},
    { header: "Result", accessorKey: "result", cell: ({ row }: any) => {
      const r = row.original.result;
      const colors: Record<string, string> = { pass: "text-green-600", fail: "text-red-600", conditional_pass: "text-yellow-600", pending_review: "text-blue-600" };
      return <span className={`font-medium ${colors[r] || ""}`}>{(r || "pending").replace(/_/g, " ").toUpperCase()}</span>;
    }},
    { header: "Next Due", accessorKey: "nextInspectionDate", cell: ({ row }: any) => row.original.nextInspectionDate ? new Date(row.original.nextInspectionDate).toLocaleDateString() : "—" },
  ],
});

export default InspectionPage;
