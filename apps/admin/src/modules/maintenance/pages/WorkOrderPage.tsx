import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "N° Demande", accessorKey: "requestNumber" },
  { header: "Titre", accessorKey: "title" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const t = row.original.type;
      const labels: Record<string, string> = {
        corrective: "Corrective",
        preventive: "Préventive",
        predictive: "Prédictive",
        emergency: "Urgence",
      };
      return labels[t] || (t || "—");
    },
  },
  {
    header: "Priorité",
    accessorKey: "priority",
    cell: ({ row }: any) => {
      const p = row.original.priority;
      const colors: Record<string, string> = {
        low: "text-green-600",
        medium: "text-amber-600",
        high: "text-orange-600",
        critical: "text-red-600",
        emergency: "text-red-700",
      };
      const labels: Record<string, string> = {
        low: "Basse",
        medium: "Moyenne",
        high: "Haute",
        critical: "Critique",
        emergency: "Urgence",
      };
      return (
        <span className={`font-medium ${colors[p] || ""}`}>
          {labels[p] || (p || "—")}
        </span>
      );
    },
  },
  { header: "Planifié le", accessorKey: "scheduledDate" },
  {
    header: "Coût",
    accessorKey: "totalCost",
    cell: ({ row }: any) =>
      `${row.original.totalCost ?? 0} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        requested: "text-gray-600",
        scheduled: "text-blue-600",
        in_progress: "text-cyan-600",
        completed: "text-green-600",
        cancelled: "text-red-600",
        overdue: "text-red-700",
      };
      const labels: Record<string, string> = {
        requested: "Demandé",
        scheduled: "Planifié",
        in_progress: "En cours",
        completed: "Terminé",
        cancelled: "Annulé",
        overdue: "En retard",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {labels[s] || (s || "—")}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "title", label: "Titre", type: "text", placeholder: "Titre de l'ordre de travail", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description détaillée...", colSpan: 2 },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "corrective", label: "Corrective" },
      { value: "preventive", label: "Préventive" },
      { value: "predictive", label: "Prédictive" },
      { value: "emergency", label: "Urgence" },
    ],
  },
  {
    name: "priority",
    label: "Priorité",
    type: "select",
    placeholder: "Sélectionner la priorité",
    options: [
      { value: "low", label: "Basse" },
      { value: "medium", label: "Moyenne" },
      { value: "high", label: "Haute" },
      { value: "critical", label: "Critique" },
      { value: "emergency", label: "Urgence" },
    ],
  },
  { name: "scheduledDate", label: "Date planifiée", type: "date" },
  { name: "totalCost", label: "Coût total", type: "number", placeholder: "0", min: 0 },
  {
    name: "currency",
    label: "Devise",
    type: "select",
    placeholder: "Sélectionner la devise",
    options: [
      { value: "CDF", label: "CDF" },
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "requested", label: "Demandé" },
      { value: "scheduled", label: "Planifié" },
      { value: "in_progress", label: "En cours" },
      { value: "completed", label: "Terminé" },
      { value: "cancelled", label: "Annulé" },
      { value: "overdue", label: "En retard" },
    ],
  },
];

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  scheduledDate: z.string().optional(),
  totalCost: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  status: z.string().optional(),
});

const WorkOrderPage = createFullEntityPage({
  key: "request",
  title: "Ordres de travail",
  singular: "Ordre de travail",
  endpoint: "/maintenance-request",
  service: "transport",
  permissionPrefix: "maintenance",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    title: "",
    description: "",
    type: "",
    priority: "medium",
    scheduledDate: "",
    totalCost: "",
    currency: "CDF",
    status: "requested",
  },
});

export default WorkOrderPage;
