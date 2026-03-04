/**
 * LeavePage - Leave request management with full CRUD using TabbedForm
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@kwim/shared-ui";
import { CrudForm, CrudTable, TabbedForm } from "@kwim/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { leaveApi, employeeApi } from "../../api/hr.api";
import { leaveSchema, defaultValues, type LeaveFormValues } from "./leave.schema";
import { useLeaveTabs } from "./useLeaveTabs";

interface LeaveItem {
  _id: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  type: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: string;
  createdAt: string;
}

const LEAVE_TYPES = [
  { value: "annual", label: "Congé annuel" },
  { value: "sick", label: "Congé maladie" },
  { value: "maternity", label: "Congé maternité" },
  { value: "paternity", label: "Congé paternité" },
  { value: "unpaid", label: "Congé sans solde" },
  { value: "compensatory", label: "Repos compensatoire" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvé" },
  { value: "rejected", label: "Rejeté" },
  { value: "cancelled", label: "Annulé" },
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
    mutationFn: async (values: LeaveFormValues) =>
      editing
        ? await leaveApi.update(editing._id, values)
        : await leaveApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", `La demande de congé a été ${editing ? "modifiée" : "créée"}.`, "success");
      qc.invalidateQueries({ queryKey: ["leaves"] });
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
    mutationFn: async (id: string) => await leaveApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Demande supprimée.", "success");
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
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) =>
        LEAVE_TYPES.find((t) => t.value === row.original.type)?.label || row.original.type,
    },
    {
      accessorKey: "startDate",
      header: "Début",
      cell: ({ row }: any) =>
        row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—",
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }: any) =>
        row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "—",
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

  const tabs = useLeaveTabs({ form, employees });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Congés</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les demandes de congés
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
          data={leaves}
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
        title={editing ? "Modifier la demande" : "Nouvelle demande de congé"}
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
