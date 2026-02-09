import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { payrollApi, employeeApi } from "../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface PayrollFormValues {
  reference: string;
  employee: string;
  period: string;
  grossSalary: string;
  deductions: string;
  bonuses: string;
  netSalary: string;
  currency: string;
  status: string;
  notes: string;
}

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

interface EmpLookup { _id: string; firstName: string; lastName: string }

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "confirmed", label: "Confirmé" },
  { value: "paid", label: "Payé" },
  { value: "cancelled", label: "Annulé" },
];

const CURRENCIES = ["CDF", "USD", "EUR"];

const schema = Yup.object({
  reference: Yup.string().required("La référence est requise"),
  employee: Yup.string().required("L'employé est requis"),
  period: Yup.string().required("La période est requise"),
  grossSalary: Yup.string().required("Le salaire brut est requis"),
  deductions: Yup.string(),
  bonuses: Yup.string(),
  netSalary: Yup.string(),
  currency: Yup.string().required("La devise est requise"),
  status: Yup.string().required("Le statut est requis"),
  notes: Yup.string(),
});

const INITIAL: PayrollFormValues = {
  reference: "", employee: "", period: "", grossSalary: "",
  deductions: "0", bonuses: "0", netSalary: "", currency: "CDF",
  status: "draft", notes: "",
};

export default function PayrollPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PayrollItem | null>(null);
  const [viewing, setViewing] = useState<PayrollItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const qc = useQueryClient();

  const { data: pData, isLoading } = useQuery({ queryKey: ["payroll"], queryFn: async () => (await payrollApi.getAll()).data });
  const payrolls: PayrollItem[] = pData?.data || [];

  const { data: empData } = useQuery({ queryKey: ["employees-lookup"], queryFn: async () => (await employeeApi.getAll()).data });
  const employees: EmpLookup[] = empData?.data || [];

  const mutation = useMutation({
    mutationFn: async (v: PayrollFormValues) => editing ? await payrollApi.update(editing._id, v) : await payrollApi.create(v),
    onSuccess: () => { Swal.fire("Succès!", `La fiche de paie a été ${editing ? "modifiée" : "créée"}.`, "success"); qc.invalidateQueries({ queryKey: ["payroll"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await payrollApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Fiche de paie supprimée.", "success"); qc.invalidateQueries({ queryKey: ["payroll"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<PayrollFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        reference: editing.reference || "", employee: editing.employee?._id || "",
        period: editing.period || "", grossSalary: editing.grossSalary?.toString() || "",
        deductions: editing.deductions?.toString() || "0", bonuses: editing.bonuses?.toString() || "0",
        netSalary: editing.netSalary?.toString() || "", currency: editing.currency || "CDF",
        status: editing.status || "draft", notes: editing.notes || "",
      });
    } else formik.resetForm();
  }, [editing]);

  // Auto-calculate net salary
  useEffect(() => {
    const gross = parseFloat(formik.values.grossSalary) || 0;
    const ded = parseFloat(formik.values.deductions) || 0;
    const bon = parseFloat(formik.values.bonuses) || 0;
    formik.setFieldValue("netSalary", String(gross - ded + bon));
  }, [formik.values.grossSalary, formik.values.deductions, formik.values.bonuses]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const empName = (e?: PayrollItem["employee"]) => e ? (e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim()) : "—";
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const statusBadge = (s: string) => {
    const c: Record<string, string> = { draft: "bg-gray-100 text-gray-700", confirmed: "bg-blue-100 text-blue-700", paid: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>{STATUS_OPTIONS.find((o) => o.value === s)?.label || s}</span>;
  };

  const fmt = (n?: number, cur?: string) => `${(n || 0).toLocaleString()} ${cur || "CDF"}`;

  const columns = [
    { id: "reference", label: "Référence" },
    { id: "employee", label: "Employé", render: (r: PayrollItem) => empName(r.employee) },
    { id: "period", label: "Période" },
    { id: "grossSalary", label: "Brut", render: (r: PayrollItem) => fmt(r.grossSalary, r.currency) },
    { id: "netSalary", label: "Net", render: (r: PayrollItem) => <span className="font-medium">{fmt(r.netSalary, r.currency)}</span> },
    { id: "status", label: "Statut", render: (r: PayrollItem) => statusBadge(r.status) },
    { id: "actions", label: "Actions", render: (r: PayrollItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => { setViewing(r); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Fiches de paie</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Nouvelle fiche de paie</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier la fiche de paie" : "Nouvelle fiche de paie"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Référence</Label><Input name="reference" value={formik.values.reference} onChange={formik.handleChange} />{formik.touched.reference && formik.errors.reference && <p className="text-red-500 text-xs mt-1">{formik.errors.reference}</p>}</div>
                      <div><Label>Période</Label><Input name="period" placeholder="ex: Janvier 2026" value={formik.values.period} onChange={formik.handleChange} />{formik.touched.period && formik.errors.period && <p className="text-red-500 text-xs mt-1">{formik.errors.period}</p>}</div>
                    </div>
                    <div>
                      <Label>Employé</Label>
                      <Select value={formik.values.employee} onValueChange={(v) => formik.setFieldValue("employee", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>{employees.map((e) => <SelectItem key={e._id} value={e._id}>{e.firstName} {e.lastName}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><Label>Salaire brut</Label><Input name="grossSalary" type="number" value={formik.values.grossSalary} onChange={formik.handleChange} /></div>
                      <div><Label>Déductions</Label><Input name="deductions" type="number" value={formik.values.deductions} onChange={formik.handleChange} /></div>
                      <div><Label>Bonus</Label><Input name="bonuses" type="number" value={formik.values.bonuses} onChange={formik.handleChange} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Salaire net</Label><Input name="netSalary" type="number" value={formik.values.netSalary} readOnly className="bg-gray-50" /></div>
                      <div>
                        <Label>Devise</Label>
                        <Select value={formik.values.currency} onValueChange={(v) => formik.setFieldValue("currency", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectGroup>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue("status", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectGroup>{STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div><Label>Notes</Label><Textarea name="notes" value={formik.values.notes} onChange={formik.handleChange} rows={2} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={payrolls} />}
        </div>
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Détails de la fiche de paie</DialogTitle></DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm py-2">
              <div><span className="font-medium text-muted-foreground">Référence:</span> {viewing.reference}</div>
              <div><span className="font-medium text-muted-foreground">Employé:</span> {empName(viewing.employee)}</div>
              <div><span className="font-medium text-muted-foreground">Période:</span> {viewing.period}</div>
              <div><span className="font-medium text-muted-foreground">Statut:</span> {statusBadge(viewing.status)}</div>
              <div><span className="font-medium text-muted-foreground">Brut:</span> {fmt(viewing.grossSalary, viewing.currency)}</div>
              <div><span className="font-medium text-muted-foreground">Déductions:</span> {fmt(viewing.deductions, viewing.currency)}</div>
              <div><span className="font-medium text-muted-foreground">Bonus:</span> {fmt(viewing.bonuses, viewing.currency)}</div>
              <div><span className="font-medium text-muted-foreground font-bold">Net:</span> <span className="font-bold">{fmt(viewing.netSalary, viewing.currency)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
