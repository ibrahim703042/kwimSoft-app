import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { RelationalField } from "@/core/crud/RelationalField";

const columns = [
  { header: "Référence", accessorKey: "reference" },
  { header: "Titre", accessorKey: "title" },
  {
    header: "Produit",
    accessorKey: "product",
    cell: ({ row }: any) => row.original.product?.name || row.original.product || "—",
  },
  {
    header: "Type",
    accessorKey: "checkType",
    cell: ({ row }: any) => (row.original.checkType || "—").toUpperCase(),
  },
  {
    header: "Résultat",
    accessorKey: "result",
    cell: ({ row }: any) => {
      const r = row.original.result;
      const colors: Record<string, string> = {
        pass: "text-green-600",
        fail: "text-red-600",
        pending: "text-yellow-600",
      };
      return <span className={`font-medium ${colors[r] || ""}`}>{(r || "—").toUpperCase()}</span>;
    },
  },
  {
    header: "Date",
    accessorKey: "checkDate",
    cell: ({ row }: any) =>
      row.original.checkDate ? new Date(row.original.checkDate).toLocaleDateString() : "—",
  },
];

const formFields: FieldConfig[] = [
  { name: "reference", label: "Référence", type: "text", placeholder: "QC-001" },
  { name: "title", label: "Titre", type: "text", placeholder: "Contrôle visuel", required: true },
  {
    name: "product", label: "Produit", type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form} name="product" label="Produit"
        service="product" endpoint="/product"
        displayField="name" secondaryField="internalRef"
        placeholder="Chercher produit..."
      />
    ),
  },
  {
    name: "checkType", label: "Type de contrôle", type: "select",
    options: [
      { value: "visual", label: "Visuel" },
      { value: "dimensional", label: "Dimensionnel" },
      { value: "functional", label: "Fonctionnel" },
      { value: "material", label: "Matériau" },
    ],
  },
  { name: "checkDate", label: "Date du contrôle", type: "date" },
  {
    name: "result", label: "Résultat", type: "select",
    options: [
      { value: "pending", label: "En attente" },
      { value: "pass", label: "Conforme" },
      { value: "fail", label: "Non conforme" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Observations...", colSpan: 2 },
];

const formSchema = z.object({
  reference: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  product: z.string().optional(),
  checkType: z.string().optional(),
  checkDate: z.string().optional(),
  result: z.string().optional(),
  notes: z.string().optional(),
});

const QualityCheckPage = createFullEntityPage({
  key: "quality-check",
  title: "Contrôles qualité",
  singular: "Contrôle qualité",
  endpoint: "/quality-check",
  service: "stock",
  permissionPrefix: "quality_check",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    reference: "",
    title: "",
    product: "",
    checkType: "visual",
    checkDate: "",
    result: "pending",
    notes: "",
  },
});

export default QualityCheckPage;
