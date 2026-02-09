import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { leaveApi, employeeApi } from "../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface LeaveFormValues {
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

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

interface EmpLookup { _id: string; firstName: string; lastName: string }

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

const schema = Yup.object({
  employee: Yup.string().required("L'employé est requis"),
  type: Yup.string().required("Le type est requis"),
  startDate: Yup.string().required("La date de début est requise"),
  endDate: Yup.string().required("La date de fin est requise"),
  reason: Yup.string(),
  status: Yup.string().required("Le statut est requis"),
});

const INITIAL: LeaveFormValues = { employee: "", type: "annual", startDate: "", endDate: "", reason: "", status: "pending" };

export default function LeavePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveItem | null>(null);
  const qc = useQueryClient();

  const { data: lData, isLoading } = useQuery({ queryKey: ["leaves"], queryFn: async () => (await leaveApi.getAll()).data });
  const leaves: LeaveItem[] = lData?.data || [];

  const { data: empData } = useQuery({ queryKey: ["employees-lookup"], queryFn: async () => (await employeeApi.getAll()).data });
  const employees: EmpLookup[] = empData?.data || [];

  const mutation = useMutation({
    mutationFn: async (v: LeaveFormValues) => editing ? await leaveApi.update(editing._id, v) : await leaveApi.create(v),
    onSuccess: () => { Swal.fire("Succès!", `Le congé a été ${editing ? "modifié" : "créé"}.`, "success"); qc.invalidateQueries({ queryKey: ["leaves"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await leaveApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Congé supprimé.", "success"); qc.invalidateQueries({ queryKey: ["leaves"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<LeaveFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        employee: editing.employee?._id || "", type: editing.type || "annual",
        startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
        reason: editing.reason || "", status: editing.status || "pending",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const empName = (e?: LeaveItem["employee"]) => e ? (e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim()) : "—";
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const statusBadge = (s: string) => {
    const c: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", cancelled: "bg-gray-100 text-gray-700" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>{STATUS_OPTIONS.find((o) => o.value === s)?.label || s}</span>;
  };

  const columns = [
    { id: "employee", label: "Employé", render: (r: LeaveItem) => empName(r.employee) },
    { id: "type", label: "Type", render: (r: LeaveItem) => LEAVE_TYPES.find((t) => t.value === r.type)?.label || r.type },
    { id: "startDate", label: "Du", render: (r: LeaveItem) => r.startDate ? new Date(r.startDate).toLocaleDateString() : "—" },
    { id: "endDate", label: "Au", render: (r: LeaveItem) => r.endDate ? new Date(r.endDate).toLocaleDateString() : "—" },
    { id: "totalDays", label: "Jours", render: (r: LeaveItem) => <span>{r.totalDays || "—"}</span> },
    { id: "status", label: "Statut", render: (r: LeaveItem) => statusBadge(r.status) },
    { id: "actions", label: "Actions", render: (r: LeaveItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Congés</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Demander un congé</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier le congé" : "Nouvelle demande de congé"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label>Employé</Label>
                      <Select value={formik.values.employee} onValueChange={(v) => formik.setFieldValue("employee", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>{employees.map((e) => <SelectItem key={e._id} value={e._id}>{e.firstName} {e.lastName}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                      {formik.touched.employee && formik.errors.employee && <p className="text-red-500 text-xs mt-1">{formik.errors.employee}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={formik.values.type} onValueChange={(v) => formik.setFieldValue("type", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectGroup>{LEAVE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Statut</Label>
                        <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue("status", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectGroup>{STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Du</Label><Input name="startDate" type="date" value={formik.values.startDate} onChange={formik.handleChange} />{formik.touched.startDate && formik.errors.startDate && <p className="text-red-500 text-xs mt-1">{formik.errors.startDate}</p>}</div>
                      <div><Label>Au</Label><Input name="endDate" type="date" value={formik.values.endDate} onChange={formik.handleChange} />{formik.touched.endDate && formik.errors.endDate && <p className="text-red-500 text-xs mt-1">{formik.errors.endDate}</p>}</div>
                    </div>
                    <div><Label>Motif</Label><Textarea name="reason" value={formik.values.reason} onChange={formik.handleChange} rows={3} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={leaves} />}
        </div>
      </div>
    </div>
  );
}
