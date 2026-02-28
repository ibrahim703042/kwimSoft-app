import { ColumnDef } from "@tanstack/react-table";

const STATUS_OPTIONS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  on_leave: "En congé",
  probation: "Période d'essai",
  terminated: "Résilié",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  on_leave: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  probation: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  terminated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
