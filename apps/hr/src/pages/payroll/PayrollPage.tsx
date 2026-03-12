/**
 * PayrollPage - Payroll management with full CRUD using TabbedForm
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@kwim/shared-ui";
import { CrudForm, CrudTable, TabbedForm } from "@kwim/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { payrollApi, employeeApi } from "../../api/hr.api";
import { payrollSchema, defaultValues, type PayrollFormValues } from "./payroll.schema";
import { usePayrollTabs } from "./usePayrollTabs";

interface PayrollItem {
  _id: string;
  reference?: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  period: string;
  grossSalary?: number;
  deductions?: number;
  bonuses?: number;
  netSalary?: number;
  currency?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "confirmed", label: "Confirmé" },
  { value: "paid", label: "Payé" },
  { value: "cancelled", label: "Annulé" },
];

export default function PayrollPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PayrollItem | null>(null);
  const qc = useQueryClient();

  const { data: pData, isLoading } = useQuery({
    queryKey: ["payrolls"],
    queryFn: async () => (await payrollApi.getAll()).data,
  });
  const payrolls: PayrollItem[] = pData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || [];

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        reference: editing.reference || "",
        employee: editing.employee?._id || "",
        period: editing.period || "",
        grossSalary: editing.grossSalary?.toString() || "",
        deductions: editing.deductions?.toString() || "0",
        bonuses: editing.bonuses?.toString() || "0",
        netSalary: editing.netSalary?.toString() || "",
        currency: editing.currency || "CDF",
        status: editing.status || "draft",
        notes: editing.notes || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: PayrollFormValues) =>
      editing
        ? await payrollApi.update(editing._id, values)
        : await payrollApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", `La fiche de paie a été ${editing ? "modifiée" : "créée"}.`, "success");
      qc.invalidateQueries({ queryKey: ["payrolls"] });
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
    mutationFn: async (id: string) => await payrollApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Fiche de paie supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["payrolls"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const empName = (e?: PayrollItem["employee"]) =>
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
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const columns = [
    { accessorKey: "reference", header: "Référence" },
    {
      accessorKey: "employee",
      header: "Employé",
      cell: ({ row }: any) => empName(row.original.employee),
    },
    { accessorKey: "period", header: "Période" },
    {
      accessorKey: "grossSalary",
      header: "Brut",
      cell: ({ row }: any) =>
        `${row.original.grossSalary || 0} ${row.original.currency || "CDF"}`,
    },
    {
      accessorKey: "netSalary",
      header: "Net",
      cell: ({ row }: any) =>
        `${row.original.netSalary || 0} ${row.original.currency || "CDF"}`,
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

  const tabs = usePayrollTabs({ form, employees });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Paie</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les fiches de paie des employés
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
          data={payrolls}
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
        title={editing ? "Modifier la fiche de paie" : "Nouvelle fiche de paie"}
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
