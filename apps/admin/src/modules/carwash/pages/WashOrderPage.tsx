import { z } from "zod";
import { createFullEntityPage, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "N° Commande", accessorKey: "orderNumber" },
  { header: "Plaque véhicule", accessorKey: "vehiclePlateNumber" },
  {
    header: "Type véhicule",
    accessorKey: "vehicleType",
    cell: ({ row }: any) => {
      const t = row.original.vehicleType;
      const labels: Record<string, string> = {
        car: "Voiture",
        suv: "SUV",
        truck: "Camion",
        motorcycle: "Moto",
        bus: "Bus",
      };
      return labels[t] || (t || "—");
    },
  },
  {
    header: "Prix",
    accessorKey: "totalPrice",
    cell: ({ row }: any) =>
      `${row.original.totalPrice ?? 0} ${row.original.currency || "CDF"}`,
  },
  {
    header: "Paiement",
    accessorKey: "paymentStatus",
    cell: ({ row }: any) => {
      const s = row.original.paymentStatus;
      const colors: Record<string, string> = {
        pending: "text-amber-600",
        paid: "text-green-600",
      };
      const labels: Record<string, string> = {
        pending: "En attente",
        paid: "Payé",
      };
      return (
        <span className={`font-medium ${colors[s] || ""}`}>
          {labels[s] || (s || "—")}
        </span>
      );
    },
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = {
        queued: "text-gray-600",
        in_progress: "text-blue-600",
        washing: "text-cyan-600",
        completed: "text-green-600",
        cancelled: "text-red-600",
      };
      const labels: Record<string, string> = {
        queued: "En file",
        in_progress: "En cours",
        washing: "Lavage",
        completed: "Terminé",
        cancelled: "Annulé",
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
  { name: "vehiclePlateNumber", label: "Plaque du véhicule", type: "text", placeholder: "Ex: AB 1234 CD", required: true },
  {
    name: "vehicleType",
    label: "Type de véhicule",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "car", label: "Voiture" },
      { value: "suv", label: "SUV" },
      { value: "truck", label: "Camion" },
      { value: "motorcycle", label: "Moto" },
      { value: "bus", label: "Bus" },
    ],
  },
  { name: "totalPrice", label: "Prix total", type: "number", placeholder: "0", min: 0 },
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
    name: "paymentStatus",
    label: "Statut de paiement",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "pending", label: "En attente" },
      { value: "paid", label: "Payé" },
    ],
  },
  {
    name: "status",
    label: "Statut",
    type: "select",
    placeholder: "Sélectionner le statut",
    options: [
      { value: "queued", label: "En file" },
      { value: "in_progress", label: "En cours" },
      { value: "washing", label: "Lavage" },
      { value: "completed", label: "Terminé" },
      { value: "cancelled", label: "Annulé" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes...", colSpan: 2 },
];

const formSchema = z.object({
  vehiclePlateNumber: z.string().min(1, "La plaque est requise"),
  vehicleType: z.string().optional(),
  totalPrice: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().optional(),
  paymentStatus: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

const WashOrderPage = createFullEntityPage({
  key: "wash-order",
  title: "Commandes de lavage",
  singular: "Commande",
  endpoint: "/wash-order",
  service: "transport",
  permissionPrefix: "wash_order",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    vehiclePlateNumber: "",
    vehicleType: "",
    totalPrice: "",
    currency: "CDF",
    paymentStatus: "pending",
    status: "queued",
    notes: "",
  },
});

export default WashOrderPage;
