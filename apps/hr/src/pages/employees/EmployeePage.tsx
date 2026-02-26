/**
 * EmployeePage — Employee list with CrudTable
 */
import { useState } from "react";
import { Plus, Search, Users, Filter, Download, Upload } from "lucide-react";
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

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [search, setSearch] = useState("");
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

  const filteredEmployees = employees.filter(
    (e) =>
      e.firstName.toLowerCase().includes(search.toLowerCase()) ||
      e.lastName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleView = (emp: Employee) => {
    console.log("View employee:", emp);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Employees
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[#0F123F]" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            {/* Add Employee */}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <CrudTable
          data={filteredEmployees}
          columns={columns}
          enablePagination
          pageSize={10}
          onEdit={openEdit}
          onDelete={handleDelete}
          onView={handleView}
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
