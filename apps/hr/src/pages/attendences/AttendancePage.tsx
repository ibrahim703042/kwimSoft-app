/**
 * AttendancePage - Attendance management with full CRUD using TabbedForm
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@kwim/shared-ui";
import { CrudForm, CrudTable, TabbedForm } from "@kwim/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { attendanceApi, employeeApi } from "../../api/hr.api";
import { attendanceSchema, defaultValues, type AttendanceFormValues } from "./attendance.schema";
import { useAttendanceTabs } from "./useAttendanceTabs";

interface AttendanceItem {
  _id: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  notes?: string;
  attendanceType?: string;
  identifier?: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "present", label: "Présent" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "En retard" },
  { value: "half_day", label: "Demi-journée" },
  { value: "remote", label: "Télétravail" },
];

const ATTENDANCE_TYPE_OPTIONS = [
  { value: "manual", label: "Manuel" },
  { value: "biometric", label: "Biométrique" },
  { value: "wifi", label: "WiFi" },
  { value: "qr", label: "QR Code" },
  { value: "ip", label: "IP" },
];

export default function AttendancePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceItem | null>(null);
  const qc = useQueryClient();

  const { data: aData, isLoading } = useQuery({
    queryKey: ["attendances"],
    queryFn: async () => (await attendanceApi.getAll()).data,
  });
  const attendances: AttendanceItem[] = aData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || [];

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        employee: editing.employee?._id || "",
        date: editing.date ? editing.date.slice(0, 10) : "",
        checkInTime: editing.checkInTime || "",
        checkOutTime: editing.checkOutTime || "",
        status: editing.status || "present",
        notes: editing.notes || "",
        attendanceType: editing.attendanceType || "manual",
        identifier: editing.identifier || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: AttendanceFormValues) =>
      editing
        ? await attendanceApi.update(editing._id, values)
        : await attendanceApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", `Le pointage a été ${editing ? "modifié" : "créé"}.`, "success");
      qc.invalidateQueries({ queryKey: ["attendances"] });
      closeForm();
    },
    onError: (e: any) =>
      Swal.fire(
        "Erreur!",
        e.response?.data?.message || "Une erreur est survenue.",
        "error"
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await attendanceApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Pointage supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["attendances"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const empName = (e?: AttendanceItem["employee"]) =>
    e ? e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim() : "—";

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      present: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      half_day: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      remote: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const columns = [
    {
      accessorKey: "employee",
      header: "Employé",
      cell: ({ row }: any) => empName(row.original.employee),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) =>
        row.original.date ? new Date(row.original.date).toLocaleDateString() : "—",
    },
    {
      accessorKey: "checkInTime",
      header: "Arrivée",
      cell: ({ row }: any) => row.original.checkInTime || "—",
    },
    {
      accessorKey: "checkOutTime",
      header: "Départ",
      cell: ({ row }: any) => row.original.checkOutTime || "—",
    },
    {
      accessorKey: "attendanceType",
      header: "Type",
      cell: ({ row }: any) =>
        ATTENDANCE_TYPE_OPTIONS.find((t) => t.value === row.original.attendanceType)?.label ||
        row.original.attendanceType ||
        "Manuel",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => statusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditing(row.original);
              setFormOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const tabs = useAttendanceTabs({ form, employees });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Pointages</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les pointages des employés
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <CrudTable
          data={attendances}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
          else setFormOpen(true);
        }}
        title={editing ? "Modifier le pointage" : "Nouveau pointage"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <div className="border-b my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </div>
  );
}
