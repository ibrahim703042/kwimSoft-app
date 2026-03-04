import { z } from "zod";
import { createFullEntityPage, RelationalField, type FieldConfig } from "@/core/crud";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Séquence", accessorKey: "sequence" },
  {
    header: "Poste de travail",
    accessorKey: "workCenter",
    cell: ({ row }: any) => row.original.workCenter?.name || row.original.workCenter || "—",
  },
  {
    header: "Durée (min)",
    accessorKey: "durationMinutes",
    cell: ({ row }: any) => row.original.durationMinutes || "—",
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => (row.original.type || "—").toUpperCase(),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom de l'opération", type: "text", placeholder: "Découpe, Assemblage...", required: true },
  { name: "sequence", label: "Séquence", type: "number", placeholder: "10", min: 0 },
  {
    name: "workCenter",
    label: "Poste de travail",
    type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form}
        name="workCenter"
        label="Poste de travail"
        service="stock"
        endpoint="/work-center"
        displayField="name"
        secondaryField="code"
        placeholder="Chercher poste..."
        createFields={[
          { name: "name", label: "Nom", type: "text" as const, required: true },
          { name: "code", label: "Code", type: "text" as const },
        ]}
        createSchema={z.object({ name: z.string().min(1), code: z.string().optional() })}
      />
    ),
  },
  { name: "durationMinutes", label: "Durée estimée (min)", type: "number", placeholder: "30", min: 0 },
  {
    name: "type", label: "Type", type: "select",
    options: [
      { value: "work_order", label: "Ordre de travail" },
      { value: "quality_check", label: "Contrôle qualité" },
      { value: "setup", label: "Mise en place" },
      { value: "teardown", label: "Démontage" },
    ],
  },
  { name: "description", label: "Instructions", type: "textarea", placeholder: "Instructions détaillées pour cette opération...", colSpan: 2 },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  sequence: z.number().min(0).optional().or(z.literal("")),
  workCenter: z.string().optional(),
  durationMinutes: z.number().min(0).optional().or(z.literal("")),
  type: z.string().optional(),
  description: z.string().optional(),
});

const OperationPage = createFullEntityPage({
  key: "operation",
  title: "Opérations",
  singular: "Opération",
  endpoint: "/operation",
  service: "stock",
  permissionPrefix: "operation",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    sequence: "",
    workCenter: "",
    durationMinutes: "",
    type: "work_order",
    description: "",
  },
});

export default OperationPage;
