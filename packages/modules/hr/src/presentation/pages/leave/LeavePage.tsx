import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@kwim/shared-ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { leaveApi, employeeApi } from "../../../application/hr.api";
import EnhancedTable from "../../components/EnhancedTable";
import { CrudForm, TabbedForm } from "@kwim/core";
import { leaveSchema, defaultValues, type LeaveFormValues } from "./leave.schema";
import { useLeaveTabs } from "./useLeaveTabs";

interface LeaveItem {
  _id: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  type: string;
  startDate: string;
  endDate: string;
  totalDays?: number;
  reason?: string;
  status: string;
  createdAt: string;
}

const LEAVE_TYPES = [
  { value: "annual", label: "CongÃ© annuel" },
  { value: "sick", label: "CongÃ© maladie" },
  { value: "maternity", label: "CongÃ© maternitÃ©" },
  { value: "paternity", label: "CongÃ© paternitÃ©" },
  { value: "unpaid", label: "CongÃ© sans solde" },
  { value: "compensatory", label: "Repos compensatoire" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "approved", label: "ApprouvÃ©" },
  { value: "rejected", label: "RejetÃ©" },
  { value: "cancelled", label: "AnnulÃ©" },
];

export default function LeavePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveItem | null>(null);
  const qc = useQueryClient();

  const { data: lData, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => (await leaveApi.getAll()).data,
  });
  const leaves: LeaveItem[] = lData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || [];

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        employee: editing.employee?._id || "",
        type: editing.type || "annual",
        startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
        reason: editing.reason || "",
        status: editing.status || "pending",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (v: LeaveFormValues) =>
      editing ? await leaveApi.update(editing._id, v) : await leaveApi.create(v),
    onSuccess: () => {
      Swal.fire("SuccÃ¨s!", `Le congÃ© a Ã©tÃ© ${editing ? "modifiÃ©" : "crÃ©Ã©"}.`, "success");
      qc.invalidateQueries({ queryKey: ["leaves"] });
      closeForm();
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await leaveApi.delete(id),
    onSuccess: () => {
      Swal.fire("SupprimÃ©!", "CongÃ© supprimÃ©.", "success");
      qc.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const empName = (e?: LeaveItem["employee"]) =>
    e ? (e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim()) : "â€”";
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "ÃŠtes-vous sÃ»r?",
      text: "Cette action est irrÃ©versible!",
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
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const columns = [
    { id: "employee", label: "EmployÃ©", render: (r: LeaveItem) => empName(r.employee) },
    {
      id: "type",
      label: "Type",
      render: (r: LeaveItem) => LEAVE_TYPES.find((t) => t.value === r.type)?.label || r.type,
    },
    {
      id: "startDate",
      label: "Du",
      render: (r: LeaveItem) => (r.startDate ? new Date(r.startDate).toLocaleDateString() : "â€”"),
    },
    {
      id: "endDate",
      label: "Au",
      render: (r: LeaveItem) => (r.endDate ? new Date(r.endDate).toLocaleDateString() : "â€”"),
    },
    { id: "totalDays", label: "Jours", render: (r: LeaveItem) => <span>{r.totalDays ?? "â€”"}</span> },
    { id: "status", label: "Statut", render: (r: LeaveItem) => statusBadge(r.status) },
    {
      id: "actions",
      label: "Actions",
      render: (r: LeaveItem) => (
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

  const tabs = useLeaveTabs({ form, employees });

  return (
    <div>
      <div className="bg-card py-2 px-3 h-full border rounded-md">
        <div>
          <div className="bg-slate-100 p-1 rounded px-2 py-1">
            <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">
              CongÃ©s
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
              <Plus color="white" /> Demander un congÃ©
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <EnhancedTable columns={columns} data={leaves} />
          )}
        </div>
      </div>

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
        title={editing ? "Modifier le congÃ©" : "Nouvelle demande de congÃ©"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "CrÃ©er"}
        cancelText="Annuler"
        wide
      >
        <div className="border-b my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </div>
  );
}

