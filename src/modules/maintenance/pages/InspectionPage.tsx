import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "N° Inspection", accessorKey: "inspectionNumber" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const t = row.original.type;
      const labels: Record<string, string> = {
        routine: "Routine",
        safety: "Sécurité",
        compliance: "Conformité",
        special: "Spéciale",
      };
      return labels[t] || (t || "—");
    },
  },
  { header: "Inspecteur", accessorKey: "inspectorName" },
  { header: "Date", accessorKey: "inspectionDate" },
  {
    header: "Score",
    accessorKey: "overallScore",
    cell: ({ row }: any) => {
      const score = row.original.overallScore;
      if (score == null) return "—";
      const color =
        score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";
      return <span className={`font-medium ${color}`}>{score}/100</span>;
    },
  },
  {
    header: "Résultat",
    accessorKey: "result",
    cell: ({ row }: any) => {
      const r = row.original.result;
      const colors: Record<string, string> = {
        pass: "text-green-600",
        fail: "text-red-600",
        conditional_pass: "text-amber-600",
        pending_review: "text-blue-600",
      };
      const labels: Record<string, string> = {
        pass: "Réussi",
        fail: "Échoué",
        conditional_pass: "Conditionnel",
        pending_review: "En révision",
      };
      return (
        <span className={`font-medium ${colors[r] || ""}`}>
          {labels[r] || (r || "—")}
        </span>
      );
    },
  },
  { header: "Prochaine échéance", accessorKey: "nextInspectionDate" },
];

const formFields: FieldConfig[] = [
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "routine", label: "Routine" },
      { value: "safety", label: "Sécurité" },
      { value: "compliance", label: "Conformité" },
      { value: "special", label: "Spéciale" },
    ],
  },
  { name: "inspectorName", label: "Inspecteur", type: "text", placeholder: "Nom de l'inspecteur", required: true },
  { name: "inspectionDate", label: "Date d'inspection", type: "date", required: true },
  { name: "overallScore", label: "Score global", type: "number", placeholder: "0", min: 0, max: 100 },
  {
    name: "result",
    label: "Résultat",
    type: "select",
    placeholder: "Sélectionner le résultat",
    options: [
      { value: "pass", label: "Réussi" },
      { value: "fail", label: "Échoué" },
      { value: "conditional_pass", label: "Conditionnel" },
      { value: "pending_review", label: "En révision" },
    ],
  },
  { name: "nextInspectionDate", label: "Prochaine inspection", type: "date" },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes...", colSpan: 2 },
];

const formSchema = z.object({
  type: z.string().optional(),
  inspectorName: z.string().min(1, "Le nom de l'inspecteur est requis"),
  inspectionDate: z.string().min(1, "La date d'inspection est requise"),
  overallScore: z.number().min(0).max(100).optional().or(z.literal("")),
  result: z.string().optional(),
  nextInspectionDate: z.string().optional(),
  notes: z.string().optional(),
});

const InspectionPage = createFullEntityPage({
  key: "inspection",
  title: "Inspections",
  singular: "Inspection",
  endpoint: "/inspection",
  service: "transport",
  permissionPrefix: "inspection",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    type: "",
    inspectorName: "",
    inspectionDate: "",
    overallScore: "",
    result: "",
    nextInspectionDate: "",
    notes: "",
  },
});

export default InspectionPage;
