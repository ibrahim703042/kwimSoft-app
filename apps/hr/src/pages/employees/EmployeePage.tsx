/**
 * EmployeePage — Employee list with CrudTable
 */
import { useState } from "react";
import { Plus, Users, Download, Upload } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kwim/shared-ui";
import { CrudTable } from "@kwim/core";
import { PageHeader } from "@/components/PageHeader";
import { PageFilters } from "@/components/PageFilters";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  branch: string;
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@company.com",
    phone: "0685873736262",
    department: "IT",
    position: "Developer",
    branch: "Paris",
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@company.com",
    phone: "434343434",
    department: "HR",
    position: "Manager",
    branch: "Lyon",
    joinDate: "2023-06-20",
    status: "active",
  },
  {
    id: "3",
    firstName: "Pierre",
    lastName: "Bernard",
    email: "pierre.bernard@company.com",
    phone: "12345",
    department: "Finance",
    position: "Analyst",
    branch: "Marseille",
    joinDate: "2022-11-10",
    status: "inactive",
  },
  {
    id: "4",
    firstName: "Sophie",
    lastName: "Durand",
    email: "sophie.durand@company.com",
    phone: "43434546456",
    department: "Sales",
    position: "Sales Rep",
    branch: "Paris",
    joinDate: "2024-02-01",
    status: "active",
  },
  {
    id: "5",
    firstName: "Omar",
    lastName: "Bashir",
    email: "omar@hub.com",
    phone: "07550705445",
    department: "Marketing",
    position: "Designer",
    branch: "Lyon",
    joinDate: "2023-09-15",
    status: "active",
  },
  {
    id: "6",
    firstName: "Numan",
    lastName: "Khan",
    email: "ijazin9645@gmail.com",
    phone: "00415814314",
    department: "IT",
    position: "Senior Dev",
    branch: "Paris",
    joinDate: "2021-03-20",
    status: "active",
  },
];

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "avatar",
    header: "IMG",
    cell: ({ row }) => (
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
        {row.original.firstName.charAt(0)}{row.original.lastName.charAt(0)}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => (
      <div className="font-medium text-primary hover:underline cursor-pointer">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "phone",
    header: "CONTACT",
    cell: ({ row }) => <span>{row.original.phone}</span>,
  },
  {
    accessorKey: "department",
    header: "DEPARTMENT",
  },
  {
    accessorKey: "position",
    header: "POSITION",
  },
  {
    accessorKey: "branch",
    header: "BRANCH",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
          }`}
      >
        {row.original.status === "active" ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DEPARTMENT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "it", label: "IT" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    branch: string;
    joinDate: string;
    status: "active" | "inactive";
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    branch: "",
    joinDate: "",
    status: "active",
  });

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.firstName.toLowerCase().includes(search.toLowerCase()) ||
      e.lastName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "all" || e.department.toLowerCase() === departmentFilter;
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openCreate = () => {
    setEditing(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      branch: "",
      joinDate: "",
      status: "active",
    });
    setDialogOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      position: emp.position,
      branch: emp.branch,
      joinDate: emp.joinDate,
      status: emp.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editing.id ? { ...emp, ...formData } : emp))
      );
    } else {
      setEmployees((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (emp: Employee) => {
    if (confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) {
      setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
    }
  };

  const handleBulkDelete = (rows: Employee[]) => {
    if (confirm(`Are you sure you want to delete ${rows.length} employee(s)?`)) {
      const ids = new Set(rows.map((r) => r.id));
      setEmployees((prev) => prev.filter((e) => !ids.has(e.id)));
    }
  };

  const handleView = (emp: Employee) => {
    console.log("View employee:", emp);
  };

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        icon={Users}
        actions={[
          { icon: Upload, label: "Import", variant: "outline" },
          { icon: Download, label: "Export", variant: "outline" },
          { icon: Plus, label: "Add Employee", variant: "default", onClick: openCreate },
        ]}
      />

      <PageFilters
        cardTitle="Data"
        cardCount={filteredEmployees.length}
        searchPlaceholder="Search employees..."
        searchValue={search}
        onSearchChange={setSearch}
        selects={[
          {
            placeholder: "Department",
            value: departmentFilter,
            onValueChange: setDepartmentFilter,
            options: DEPARTMENT_OPTIONS,
          },
          {
            placeholder: "Status",
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: STATUS_OPTIONS,
          },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg border min-w-0 overflow-hidden">
        <CrudTable
          data={filteredEmployees}
          columns={columns}
          enablePagination
          pageSize={10}
          onEdit={openEdit}
          onDelete={handleDelete}
          onView={handleView}
          enableRowSelection
          getRowId={(row) => row.id}
          onBulkDelete={handleBulkDelete}
          permissions={{
            read: "employee.read",
            create: "employee.create",
            update: "employee.update",
            delete: "employee.delete",
          }}
        />
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) => setFormData((p) => ({ ...p, department: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Branch</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(v) => setFormData((p) => ({ ...p, branch: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paris">Paris</SelectItem>
                    <SelectItem value="Lyon">Lyon</SelectItem>
                    <SelectItem value="Marseille">Marseille</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Join Date</Label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData((p) => ({ ...p, joinDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v: "active" | "inactive") => setFormData((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0F123F]">
                {editing ? "Save Changes" : "Add Employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
