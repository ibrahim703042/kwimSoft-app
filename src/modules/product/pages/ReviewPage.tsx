import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Client", accessorKey: "customerName" },
  {
    header: "Note",
    accessorKey: "rating",
    cell: ({ row }: any) => {
      const r = row.original.rating ?? 0;
      return "★".repeat(r) + "☆".repeat(Math.max(0, 5 - r));
    },
  },
  { header: "Titre", accessorKey: "title" },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        pending: "text-amber-600",
        approved: "text-green-600",
        rejected: "text-red-600",
      };
      const labels: Record<string, string> = {
        pending: "En attente",
        approved: "Approuvé",
        rejected: "Rejeté",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {labels[s] || s || "—"}
        </span>
      );
    },
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }: any) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString("fr-FR")
        : "—",
  },
];

const formFields: FieldConfig[] = [
  { name: "customerName", label: "Nom du client", type: "text", placeholder: "Nom du client", required: true },
  { name: "rating", label: "Note", type: "number", placeholder: "1-5", min: 1, max: 5 },
  { name: "title", label: "Titre", type: "text", placeholder: "Titre de l'avis" },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "pending", label: "En attente" },
      { value: "approved", label: "Approuvé" },
      { value: "rejected", label: "Rejeté" },
    ],
  },
  { name: "comment", label: "Commentaire", type: "textarea", placeholder: "Commentaire de l'avis", colSpan: 2 },
];

const formSchema = z.object({
  customerName: z.string().min(1, "Le nom du client est requis"),
  rating: z.number().min(1, "Note minimum 1").max(5, "Note maximum 5").optional().or(z.literal("")),
  title: z.string().optional(),
  comment: z.string().optional(),
  status: z.string().optional(),
});

const ReviewPage = createFullEntityPage({
  key: "product-review",
  title: "Avis",
  singular: "Avis",
  endpoint: "/product-review",
  service: "product",
  permissionPrefix: "product_review",
  columns,
  formFields,
  formSchema,
  defaultValues: { customerName: "", rating: "", title: "", comment: "", status: "pending" },
});

export default ReviewPage;
