import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { attendanceApi, employeeApi } from "../../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";
import { CrudForm } from "@/core/crud/CrudForm";
import { TabbedForm } from "@/core/crud/TabbedForm";
import { attendanceSchema, defaultValues, type AttendanceFormValues } from "./attendance.schema";
import { useAttendanceTabs } from "./useAttendanceTabs";

interface AttendanceItem {
  _id: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
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

export default function AttendancePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceItem | null>(null);
  const qc = useQueryClient();

  const { data: aData, isLoading } = useQuery({
    queryKey: ["attendance"],
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
    mutationFn: async (v: AttendanceFormValues) =>
      editing ? await attendanceApi.update(editing._id, v) : await attendanceApi.create(v),
    onSuccess: () => {
      Swal.fire("Succès!", `La présence a été ${editing ? "modifiée" : "enregistrée"}.`, "success");
      qc.invalidateQueries({ queryKey: ["attendance"] });
      closeForm();
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await attendanceApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Enregistrement supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const empName = (e?: AttendanceItem["employee"]) =>
    e ? (e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim()) : "—";
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
    const c: Record<string, string> = {
      present: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      half_day: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      remote: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const columns = [
    { id: "employee", label: "Employé", render: (r: AttendanceItem) => empName(r.employee) },
    {
      id: "date",
      label: "Date",
      render: (r: AttendanceItem) => (r.date ? new Date(r.date).toLocaleDateString() : "—"),
    },
    {
      id: "attendanceType",
      label: "Type",
      render: (r: AttendanceItem) => r.attendanceType || "manual",
    },
    {
      id: "identifier",
      label: "Identifiant",
      render: (r: AttendanceItem) => r.identifier || "—",
    },
    { id: "checkInTime", label: "Arrivée", render: (r: AttendanceItem) => r.checkInTime || "—" },
    { id: "checkOutTime", label: "Départ", render: (r: AttendanceItem) => r.checkOutTime || "—" },
    {
      id: "totalHours",
      label: "Heures",
      render: (r: AttendanceItem) => (r.totalHours != null ? `${r.totalHours}h` : "—"),
    },
    { id: "status", label: "Statut", render: (r: AttendanceItem) => statusBadge(r.status) },
    {
      id: "actions",
      label: "Actions",
      render: (r: AttendanceItem) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => { setEditing(r); setFormOpen(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const tabs = useAttendanceTabs({ form, employees });

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div>
          <div className="bg-slate-100 p-1 rounded px-2 py-1">
            <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">
              Présences
            </p>
          </div>
        </div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Button
              className="bg-[#0F123F] py-2 px-2 text-[0.8rem]"
              size="sm"
              onClick={() => { setEditing(null); setFormOpen(true); }}
            >
              <Plus color="white" /> Enregistrer une présence
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <EnhancedTable columns={columns} data={attendances} />
          )}
        </div>
      </div>

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
        title={editing ? "Modifier la présence" : "Nouvelle présence"}
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
