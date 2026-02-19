import { ColumnDef } from "@tanstack/react-table";

const STATUS_OPTIONS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  on_leave: "En congé",
  probation: "Période d'essai",
  terminated: "Résilié",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  on_leave: "bg-yellow-100 text-yellow-700",
  probation: "bg-blue-100 text-blue-700",
  terminated: "bg-red-100 text-red-700",
};

export interface EmployeeRow {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  department?: { _id: string; name: string };
  position?: { _id: string; title: string };
  hireDate: string;
  status: string;
  gender?: string;
}

export const employeeColumns: ColumnDef<EmployeeRow>[] = [
  { header: "Prénom", accessorKey: "firstName" },
  { header: "Nom", accessorKey: "lastName" },
  { header: "Email", accessorKey: "email" },
  { header: "Téléphone", accessorKey: "phone" },
  {
    header: "Département",
    accessorKey: "department",
    cell: ({ row }) => row.original.department?.name ?? "—",
  },
  {
    header: "Poste",
    accessorKey: "position",
    cell: ({ row }) => row.original.position?.title ?? "—",
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s] || ""}`}>
          {STATUS_OPTIONS[s] || s}
        </span>
      );
    },
  },
];
