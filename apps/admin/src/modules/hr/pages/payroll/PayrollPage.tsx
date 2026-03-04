import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { payrollApi, employeeApi } from "../../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";
import { CrudForm, TabbedForm } from "@/core/crud";
import { payrollSchema, defaultValues, type PayrollFormValues } from "./payroll.schema";
import { usePayrollTabs } from "./usePayrollTabs";

interface PayrollItem {
  _id: string;
  reference?: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  period?: string;
  grossSalary?: number;
  deductions?: number;
  bonuses?: number;
  netSalary?: number;
  currency?: string;
  status: string;
  notes?: string;
  paidAt?: string;
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
  const [viewing, setViewing] = useState<PayrollItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const qc = useQueryClient();

  const { data: pData, isLoading } = useQuery({
    queryKey: ["payroll"],
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

  const gross = form.watch("grossSalary");
  const deductions = form.watch("deductions");
  const bonuses = form.watch("bonuses");
  useEffect(() => {
    const g = parseFloat(gross || "0") || 0;
    const d = parseFloat(deductions || "0") || 0;
    const b = parseFloat(bonuses || "0") || 0;
    form.setValue("netSalary", String(g - d + b));
  }, [gross, deductions, bonuses, form]);

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
    mutationFn: async (v: PayrollFormValues) =>
      editing ? await payrollApi.update(editing._id, v) : await payrollApi.create(v),
    onSuccess: () => {
      Swal.fire("Succès!", `La fiche de paie a été ${editing ? "modifiée" : "créée"}.`, "success");
      qc.invalidateQueries({ queryKey: ["payroll"] });
      closeForm();
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await payrollApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Fiche de paie supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const empName = (e?: PayrollItem["employee"]) =>
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
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const fmt = (n?: number, cur?: string) => `${(n || 0).toLocaleString()} ${cur || "CDF"}`;

  const columns = [
    { id: "reference", label: "Référence" },
    { id: "employee", label: "Employé", render: (r: PayrollItem) => empName(r.employee) },
    { id: "period", label: "Période" },
    { id: "grossSalary", label: "Brut", render: (r: PayrollItem) => fmt(r.grossSalary, r.currency) },
    {
      id: "netSalary",
      label: "Net",
      render: (r: PayrollItem) => <span className="font-medium">{fmt(r.netSalary, r.currency)}</span>,
    },
    { id: "status", label: "Statut", render: (r: PayrollItem) => statusBadge(r.status) },
    {
      id: "actions",
      label: "Actions",
      render: (r: PayrollItem) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => { setViewing(r); setViewOpen(true); }}>
            <Eye className="h-4 w-4" />
          </Button>
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

  const tabs = usePayrollTabs({ form, employees });

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div>
          <div className="bg-slate-100 p-1 rounded px-2 py-1">
            <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">
              Fiches de paie
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
              <Plus color="white" /> Nouvelle fiche de paie
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <EnhancedTable columns={columns} data={payrolls} />
          )}
        </div>
      </div>

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la fiche de paie</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm py-2">
              <div>
                <span className="font-medium text-muted-foreground">Référence:</span> {viewing.reference}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Employé:</span> {empName(viewing.employee)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Période:</span> {viewing.period}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Statut:</span> {statusBadge(viewing.status)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Brut:</span> {fmt(viewing.grossSalary, viewing.currency)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Déductions:</span> {fmt(viewing.deductions, viewing.currency)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Bonus:</span> {fmt(viewing.bonuses, viewing.currency)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Net:</span>{" "}
                <span className="font-bold">{fmt(viewing.netSalary, viewing.currency)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
