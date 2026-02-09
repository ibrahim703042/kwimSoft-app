import { z } from "zod";
import { createFullEntityPage } from "@/core/crud/createFullEntityPage";
import { FieldConfig } from "@/core/crud/DynamicFormFields";

const columns = [
  { header: "Nom", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Téléphone", accessorKey: "phone" },
  { header: "Entreprise", accessorKey: "company" },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => (row.original.type || "—").toUpperCase(),
  },
];

const formFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", placeholder: "Nom du contact", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "email@exemple.com" },
  { name: "phone", label: "Téléphone", type: "text", placeholder: "+243 ..." },
  { name: "company", label: "Entreprise", type: "text", placeholder: "Nom de l'entreprise" },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Sélectionner le type",
    options: [
      { value: "individual", label: "Individuel" },
      { value: "company", label: "Entreprise" },
      { value: "lead", label: "Prospect" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes...", colSpan: 2 },
];

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  type: z.string().optional(),
  notes: z.string().optional(),
});

const ContactPage = createFullEntityPage({
  key: "contact",
  title: "Contacts",
  singular: "Contact",
  endpoint: "/contact",
  service: "hr",
  permissionPrefix: "contact",
  columns,
  formFields,
  formSchema,
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    notes: "",
  },
});

export default ContactPage;
