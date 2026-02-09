import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Sujet", accessorKey: "subject" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const t = row.original.type;
      const labels: Record<string, string> = {
        call: "Appel",
        meeting: "Réunion",
        email: "Email",
        task: "Tâche",
        note: "Note",
      };
      return labels[t] || (t || "—");
    },
  },
  { header: "Date d'échéance", accessorKey: "dueDate" },
  { header: "Assigné à", accessorKey: "assignedTo" },
  { header: "Statut", accessorKey: "status" },
];

const formFields: FieldConfig[] = [
  { name: "subject", label: "Sujet", type: "text", placeholder: "Sujet de l'activité", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "call", label: "Appel" },
      { value: "meeting", label: "Réunion" },
      { value: "email", label: "Email" },
      { value: "task", label: "Tâche" },
      { value: "note", label: "Note" },
    ],
  },
  { name: "dueDate", label: "Date d'échéance", type: "date" },
  { name: "assignedTo", label: "Assigné à", type: "text", placeholder: "Nom de l'assigné" },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "planned", label: "Planifié" },
      { value: "in_progress", label: "En cours" },
      { value: "done", label: "Terminé" },
      { value: "cancelled", label: "Annulé" },
    ],
  },
  { name: "description", label: "Description", type: "textarea", placeholder: "Description...", colSpan: 2 },
];

const formSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  type: z.string().optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional(),
});

const ActivityPage = createFullEntityPage({
  key: "activity",
  title: "Activités",
  singular: "Activité",
  endpoint: "/activity",
  service: "hr",
  permissionPrefix: "activity",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    subject: "",
    type: "",
    dueDate: "",
    assignedTo: "",
    status: "planned",
    description: "",
  },
});

export default ActivityPage;
