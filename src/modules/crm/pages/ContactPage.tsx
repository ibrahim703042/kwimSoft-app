import { createListPage } from "@/core/crud/createModule";
import { Contact } from "lucide-react";

const ContactPage = createListPage({
  key: "contact",
  label: "Contacts",
  endpoint: "/contact",
  service: "hr",
  permissionPrefix: "contact",
  icon: Contact,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Company", accessorKey: "company" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").toUpperCase() },
  ],
});

export default ContactPage;
