import { createGroupedModule } from "@/core/crud/createModule";
import { Users } from "lucide-react";

export const hrModule = createGroupedModule({
  name: "hr",
  label: "HR",
  icon: Users,
  basePath: "/hr",
  permission: "employee.read",
  entities: [
    {
      key: "employee",
      label: "Employees",
      endpoint: "/employee",
      service: "hr",
      permissionPrefix: "employee",
      columns: [
        { header: "Employee ID", accessorKey: "employeeId" },
        { header: "Full Name", accessorKey: "fullName", cell: ({ row }: any) => `${row.original.firstName || ""} ${row.original.lastName || ""}`.trim() || row.original.fullName },
        { header: "Email", accessorKey: "email" },
        { header: "Phone", accessorKey: "phone" },
        { header: "Department", accessorKey: "department", cell: ({ row }: any) => row.original.department?.name || row.original.departmentName || "—" },
        { header: "Position", accessorKey: "position", cell: ({ row }: any) => row.original.position?.title || row.original.positionTitle || "—" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { active: "text-green-600", inactive: "text-gray-500", on_leave: "text-yellow-600", terminated: "text-red-600", probation: "text-blue-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
        }},
      ],
    },
    {
      key: "department",
      label: "Departments",
      endpoint: "/department",
      service: "hr",
      permissionPrefix: "department",
      columns: [
        { header: "Name", accessorKey: "name" },
        { header: "Code", accessorKey: "code" },
        { header: "Manager", accessorKey: "manager", cell: ({ row }: any) => row.original.manager?.fullName || "—" },
        { header: "Employees", accessorKey: "employeeCount" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "position",
      label: "Positions",
      endpoint: "/position",
      service: "hr",
      permissionPrefix: "position",
      columns: [
        { header: "Title", accessorKey: "title" },
        { header: "Code", accessorKey: "code" },
        { header: "Department", accessorKey: "department", cell: ({ row }: any) => row.original.department?.name || "—" },
        { header: "Level", accessorKey: "level" },
        { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
      ],
    },
    {
      key: "contract",
      label: "Contracts",
      endpoint: "/contract",
      service: "hr",
      permissionPrefix: "contract",
      columns: [
        { header: "Reference", accessorKey: "reference" },
        { header: "Employee", accessorKey: "employee", cell: ({ row }: any) => row.original.employee?.fullName || "—" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Start", accessorKey: "startDate", cell: ({ row }: any) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—" },
        { header: "End", accessorKey: "endDate", cell: ({ row }: any) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "—" },
        { header: "Salary", accessorKey: "salary", cell: ({ row }: any) => `${row.original.salary || 0} ${row.original.currency || "CDF"}` },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { active: "text-green-600", expired: "text-red-600", draft: "text-gray-500" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
    {
      key: "leave",
      label: "Leave",
      endpoint: "/leave",
      service: "hr",
      permissionPrefix: "leave",
      columns: [
        { header: "Employee", accessorKey: "employee", cell: ({ row }: any) => row.original.employee?.fullName || "—" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "From", accessorKey: "startDate", cell: ({ row }: any) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—" },
        { header: "To", accessorKey: "endDate", cell: ({ row }: any) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "—" },
        { header: "Days", accessorKey: "totalDays" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { approved: "text-green-600", pending: "text-yellow-600", rejected: "text-red-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
    {
      key: "attendance",
      label: "Attendance",
      endpoint: "/attendance",
      service: "hr",
      permissionPrefix: "attendance",
      columns: [
        { header: "Employee", accessorKey: "employee", cell: ({ row }: any) => row.original.employee?.fullName || "—" },
        { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
        { header: "Check In", accessorKey: "checkInTime" },
        { header: "Check Out", accessorKey: "checkOutTime" },
        { header: "Hours", accessorKey: "totalHours" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
      ],
    },
    {
      key: "payroll",
      label: "Payroll",
      endpoint: "/payroll",
      service: "hr",
      permissionPrefix: "payroll",
      columns: [
        { header: "Reference", accessorKey: "reference" },
        { header: "Employee", accessorKey: "employee", cell: ({ row }: any) => row.original.employee?.fullName || "—" },
        { header: "Period", accessorKey: "period" },
        { header: "Gross", accessorKey: "grossSalary", cell: ({ row }: any) => `${row.original.grossSalary || 0}` },
        { header: "Net", accessorKey: "netSalary", cell: ({ row }: any) => `${row.original.netSalary || 0}` },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { draft: "text-gray-500", confirmed: "text-blue-600", paid: "text-green-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
    {
      key: "recruitment",
      label: "Recruitment",
      endpoint: "/recruitment",
      service: "hr",
      permissionPrefix: "recruitment",
      columns: [
        { header: "Title", accessorKey: "title" },
        { header: "Department", accessorKey: "department", cell: ({ row }: any) => row.original.department?.name || "—" },
        { header: "Position", accessorKey: "position", cell: ({ row }: any) => row.original.position?.title || "—" },
        { header: "Applications", accessorKey: "applicationCount" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
      ],
    },
    {
      key: "training",
      label: "Training",
      endpoint: "/training",
      service: "hr",
      permissionPrefix: "training",
      columns: [
        { header: "Title", accessorKey: "title" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Start", accessorKey: "startDate", cell: ({ row }: any) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—" },
        { header: "Participants", accessorKey: "participantCount" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
      ],
    },
    {
      key: "expense",
      label: "Expenses",
      endpoint: "/expense",
      service: "hr",
      permissionPrefix: "expense",
      columns: [
        { header: "Reference", accessorKey: "reference" },
        { header: "Employee", accessorKey: "employee", cell: ({ row }: any) => row.original.employee?.fullName || "—" },
        { header: "Type", accessorKey: "type" },
        { header: "Amount", accessorKey: "amount", cell: ({ row }: any) => `${row.original.amount || 0} ${row.original.currency || "CDF"}` },
        { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { draft: "text-gray-500", submitted: "text-blue-600", approved: "text-green-600", rejected: "text-red-600", paid: "text-green-800" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
  ],
});
