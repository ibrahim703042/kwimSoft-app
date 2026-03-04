import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Référence", accessorKey: "reference" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const labels: Record<string, string> = {
        incoming: "Entrant",
        outgoing: "Sortant",
      };
      return labels[row.original.type] || (row.original.type || "").replace(/_/g, " ").toUpperCase();
    },
  },
  {
    header: "Montant",
    accessorKey: "amount",
    cell: ({ row }: any) =>
      `${(row.original.amount || 0).toLocaleString()} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Méthode",
    accessorKey: "method",
    cell: ({ row }: any) => {
      const labels: Record<string, string> = {
        cash: "Espèces",
        bank_transfer: "Virement bancaire",
        mobile_money: "Mobile Money",
        check: "Chèque",
        card: "Carte",
      };
      return labels[row.original.method] || (row.original.method || "").replace(/_/g, " ").toUpperCase();
    },
  },
  {
    header: "Date",
    accessorKey: "paymentDate",
    cell: ({ row }: any) =>
      row.original.paymentDate
        ? new Date(row.original.paymentDate).toLocaleDateString()
        : "—",
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        pending: "text-yellow-600",
        completed: "text-green-600",
        failed: "text-red-600",
        refunded: "text-blue-600",
      };
      const labels: Record<string, string> = {
        pending: "En attente",
        completed: "Complété",
        failed: "Échoué",
        refunded: "Remboursé",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {labels[s] || (s || "").toUpperCase()}
        </span>
      );
    },
  },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "PAY-001" },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "incoming", label: "Entrant" },
      { value: "outgoing", label: "Sortant" },
    ],
  },
  { name: "amount", label: "Montant", type: "number", placeholder: "0", min: 0, required: true },
  {
    name: "currency",
    label: "Devise",
    type: "select",
    options: [
      { value: "CDF", label: "CDF" },
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
  {
    name: "method",
    label: "Méthode",
    type: "select",
    options: [
      { value: "cash", label: "Espèces" },
      { value: "bank_transfer", label: "Virement bancaire" },
      { value: "mobile_money", label: "Mobile Money" },
      { value: "check", label: "Chèque" },
      { value: "card", label: "Carte" },
    ],
  },
  { name: "paymentDate", label: "Date de paiement", type: "date" },
  {
    name: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "pending", label: "En attente" },
      { value: "completed", label: "Complété" },
      { value: "failed", label: "Échoué" },
      { value: "refunded", label: "Remboursé" },
    ],
  },
];

const formSchema = z.object({
  reference: z.string().optional(),
  type: z.string().default("incoming"),
  amount: z.number().min(0, "Le montant est requis"),
  currency: z.string().default("CDF"),
  method: z.string().default("cash"),
  paymentDate: z.string().optional(),
  status: z.string().default("pending"),
});

const PaymentPage = createFullEntityPage({
  key: "payment",
  title: "Paiements",
  singular: "Paiement",
  endpoint: "/payment",
  service: "stock",
  permissionPrefix: "payment",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    reference: "",
    type: "incoming",
    amount: 0,
    currency: "CDF",
    method: "cash",
    paymentDate: "",
    status: "pending",
  },
});

export default PaymentPage;
