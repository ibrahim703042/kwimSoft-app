import { z } from "zod";
import { createFullEntityPage } from "@kwim/core";

export default createFullEntityPage({
  key: "report",
  title: "Reports",
  singular: "Report",
  endpoint: "/report",
  service: "transport",
  permissionPrefix: "report",
  columns: [
    { header: "Report #", accessorKey: "reportNumber" },
    { header: "Title", accessorKey: "title" },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }: { row: { original: { type?: string } } }) =>
        String(row.original.type ?? "").replace(/_/g, " ").toUpperCase(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: { status?: string } } }) => {
        const s = row.original.status ?? "";
        const colors: Record<string, string> = {
          pending: "text-blue-600",
          generating: "text-yellow-600",
          completed: "text-green-600",
          failed: "text-red-600",
        };
        return <span className={`font-medium ${colors[s] || ""}`}>{s.toUpperCase()}</span>;
      },
    },
  ],
  formFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "type", label: "Type", type: "text" },
    { name: "format", label: "Format", type: "text" },
  ],
  formSchema: z.object({
    title: z.string().min(1),
    type: z.string().optional(),
    format: z.string().optional(),
  }),
  defaultValues: { title: "", type: "", format: "json" },
});
