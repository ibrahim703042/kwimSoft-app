import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";
import { RelationalField } from "@/core/crud/RelationalField";

const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Code", accessorKey: "code" },
  { header: "Warehouse", accessorKey: "warehouse", cell: ({ row }: any) => row.original.warehouse?.name || "—" },
  { header: "Type", accessorKey: "type" },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom de l'emplacement", required: true },
  { name: "code", label: "Code", type: "text", placeholder: "Ex: LOC-A1", required: true },
  { name: "type", label: "Type", type: "select", required: true, options: [
    { value: "shelf", label: "Étagère" },
    { value: "bin", label: "Bac" },
    { value: "zone", label: "Zone" },
    { value: "floor", label: "Étage" },
  ]},
  {
    name: "warehouse",
    label: "Entrepôt",
    type: "custom" as const,
    render: (form: any) => (
      <RelationalField
        form={form}
        name="warehouse"
        label="Entrepôt"
        service="stock"
        endpoint="/warehouse"
        displayField="name"
        placeholder="Chercher..."
        createFields={[
          { name: "name", label: "Nom", type: "text", required: true },
          { name: "code", label: "Code", type: "text" },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "warehouse", label: "Entrepôt" },
              { value: "store", label: "Magasin" },
              { value: "transit", label: "Transit" },
            ],
          },
        ]}
        createSchema={z.object({
          name: z.string().min(1),
          code: z.string().optional(),
          type: z.string().optional(),
        })}
      />
    ),
  },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  type: z.string().min(1, "Le type est requis"),
  warehouse: z.string().optional(),
});

const LocationPage = createFullEntityPage({
  key: "location",
  title: "Emplacements",
  singular: "Emplacement",
  endpoint: "/location",
  service: "stock",
  permissionPrefix: "location",
  columns,
  formFields,
  formSchema,
  defaultValues: { name: "", code: "", type: "", warehouse: "" },
});

export default LocationPage;
