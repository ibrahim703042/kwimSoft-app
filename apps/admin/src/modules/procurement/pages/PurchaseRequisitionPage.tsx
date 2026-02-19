import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { RelationalField } from "@/core/crud/RelationalField";

const columns = [
  { header: "N° Réquisition", accessorKey: "requisitionNumber" },
  { header: "Demandeur", accessorKey: "requestor" },
  {
    header: "Département",
    accessorKey: "department",
    cell: ({ row }: any) => row.original.department || "—",
  },
  {
    header: "Date",
    accessorKey: "requestDate",
    cell: ({ row }: any) =>
      row.original.requestDate
        ? new Date(row.original.requestDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Date souhaitée",
    accessorKey: "dateNeeded",
    cell: ({ row }: any) =>
      row.original.dateNeeded
        ? new Date(row.original.dateNeeded).toLocaleDateString()
        : "—",
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        draft: "text-gray-500",
        submitted: "text-blue-600",
        approved: "text-green-600",
        rejected: "text-red-600",
        ordered: "text-indigo-600",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {(s || "—").toUpperCase()}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "requisitionNumber", label: "N° Réquisition", type: "text", placeholder: "REQ-001" },
  { name: "requestor", label: "Demandeur", type: "text", placeholder: "Nom du demandeur", required: true },
  { name: "department", label: "Département", type: "text", placeholder: "Sales, IT..." },
  { name: "requestDate", label: "Date de demande", type: "date", required: true },
  { name: "dateNeeded", label: "Date souhaitée", type: "date" },
  {
    name: "priority", label: "Priorité", type: "select",
    options: [
      { value: "low", label: "Basse" },
      { value: "normal", label: "Normale" },
      { value: "high", label: "Haute" },
      { value: "urgent", label: "Urgente" },
    ],
  },
  {
    name: "status", label: "Statut", type: "select",
    options: [
      { value: "draft", label: "Brouillon" },
      { value: "submitted", label: "Soumis" },
      { value: "approved", label: "Approuvé" },
      { value: "rejected", label: "Rejeté" },
      { value: "ordered", label: "Commandé" },
    ],
  },
  { name: "reason", label: "Motif / Justification", type: "textarea", placeholder: "Raison de la demande...", colSpan: 2 },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes supplémentaires...", colSpan: 2 },
];

const formSchema = z.object({
  requisitionNumber: z.string().optional(),
  requestor: z.string().min(1, "Le demandeur est requis"),
  department: z.string().optional(),
  requestDate: z.string().min(1, "La date est requise"),
  dateNeeded: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

const PurchaseRequisitionPage = createFullEntityPage({
  key: "purchase-requisition",
  title: "Demandes d'achat",
  singular: "Demande d'achat",
  endpoint: "/purchase-requisition",
  service: "stock",
  permissionPrefix: "purchase_requisition",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    requisitionNumber: "",
    requestor: "",
    department: "",
    requestDate: new Date().toISOString().split("T")[0],
    dateNeeded: "",
    priority: "normal",
    status: "draft",
    reason: "",
    notes: "",
  },
});

export default PurchaseRequisitionPage;
