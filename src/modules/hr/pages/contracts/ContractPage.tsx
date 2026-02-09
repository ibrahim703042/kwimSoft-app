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
import { contractApi, employeeApi } from "../../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface ContractFormValues {
  reference: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  salary: string;
  currency: string;
  status: string;
  notes: string;
}

interface ContractItem {
  _id: string;
  reference?: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  type: string;
  startDate: string;
  endDate?: string;
  salary?: number;
  currency?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface EmpLookup { _id: string; firstName: string; lastName: string }

const CONTRACT_TYPES = [
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "interim", label: "Intérim" },
  { value: "stage", label: "Stage" },
  { value: "freelance", label: "Freelance" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "active", label: "Actif" },
  { value: "expired", label: "Expiré" },
  { value: "terminated", label: "Résilié" },
];

const CURRENCIES = ["CDF", "USD", "EUR"];

const schema = Yup.object({
  reference: Yup.string().required("La référence est requise"),
  employee: Yup.string().required("L'employé est requis"),
  type: Yup.string().required("Le type est requis"),
  startDate: Yup.string().required("La date de début est requise"),
  endDate: Yup.string(),
  salary: Yup.string().required("Le salaire est requis"),
  currency: Yup.string().required("La devise est requise"),
  status: Yup.string().required("Le statut est requis"),
  notes: Yup.string(),
});

const INITIAL: ContractFormValues = {
  reference: "", employee: "", type: "cdi", startDate: "",
  endDate: "", salary: "", currency: "CDF", status: "draft", notes: "",
};

export default function ContractPage() {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<ContractItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState<ContractItem | null>(null);
  const qc = useQueryClient();

  const { data: cData, isLoading } = useQuery({
    queryKey: ["contracts"], queryFn: async () => (await contractApi.getAll()).data,
  });
  const contracts: ContractItem[] = cData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"], queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees: EmpLookup[] = empData?.data || [];

  const mutation = useMutation({
    mutationFn: async (values: ContractFormValues) =>
      editing ? await contractApi.update(editing._id, values) : await contractApi.create(values),
    onSuccess: () => { Swal.fire("Succès!", `Le contrat a été ${editing ? "modifié" : "créé"}.`, "success"); qc.invalidateQueries({ queryKey: ["contracts"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await contractApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Contrat supprimé.", "success"); qc.invalidateQueries({ queryKey: ["contracts"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<ContractFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        reference: editing.reference || "", employee: editing.employee?._id || "",
        type: editing.type || "cdi", startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
        salary: editing.salary?.toString() || "", currency: editing.currency || "CDF",
        status: editing.status || "draft", notes: editing.notes || "",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const empName = (e?: ContractItem["employee"]) => e ? (e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim()) : "—";
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const statusBadge = (s: string) => {
    const c: Record<string, string> = { draft: "bg-gray-100 text-gray-700", active: "bg-green-100 text-green-700", expired: "bg-red-100 text-red-700", terminated: "bg-orange-100 text-orange-700" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>{STATUS_OPTIONS.find((o) => o.value === s)?.label || s}</span>;
  };

  const columns = [
    { id: "reference", label: "Référence" },
    { id: "employee", label: "Employé", render: (r: ContractItem) => empName(r.employee) },
    { id: "type", label: "Type", render: (r: ContractItem) => CONTRACT_TYPES.find((t) => t.value === r.type)?.label || r.type },
    { id: "startDate", label: "Début", render: (r: ContractItem) => r.startDate ? new Date(r.startDate).toLocaleDateString() : "—" },
    { id: "endDate", label: "Fin", render: (r: ContractItem) => r.endDate ? new Date(r.endDate).toLocaleDateString() : "—" },
    { id: "salary", label: "Salaire", render: (r: ContractItem) => `${r.salary || 0} ${r.currency || "CDF"}` },
    { id: "status", label: "Statut", render: (r: ContractItem) => statusBadge(r.status) },
    { id: "actions", label: "Actions", render: (r: ContractItem) => (
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
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Contrats</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Ajouter un contrat</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier le contrat" : "Nouveau contrat"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div><Label>Référence</Label><Input name="reference" value={formik.values.reference} onChange={formik.handleChange} />{formik.touched.reference && formik.errors.reference && <p className="text-red-500 text-xs mt-1">{formik.errors.reference}</p>}</div>
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
                          <SelectContent><SelectGroup>{CONTRACT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectGroup></SelectContent>
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
                      <div><Label>Date de début</Label><Input name="startDate" type="date" value={formik.values.startDate} onChange={formik.handleChange} />{formik.touched.startDate && formik.errors.startDate && <p className="text-red-500 text-xs mt-1">{formik.errors.startDate}</p>}</div>
                      <div><Label>Date de fin</Label><Input name="endDate" type="date" value={formik.values.endDate} onChange={formik.handleChange} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Salaire</Label><Input name="salary" type="number" value={formik.values.salary} onChange={formik.handleChange} />{formik.touched.salary && formik.errors.salary && <p className="text-red-500 text-xs mt-1">{formik.errors.salary}</p>}</div>
                      <div>
                        <Label>Devise</Label>
                        <Select value={formik.values.currency} onValueChange={(v) => formik.setFieldValue("currency", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectGroup>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div><Label>Notes</Label><Textarea name="notes" value={formik.values.notes} onChange={formik.handleChange} rows={3} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={contracts} />}
        </div>
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Détails du contrat</DialogTitle></DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm py-2">
              <div><span className="font-medium text-muted-foreground">Référence:</span> {viewing.reference}</div>
              <div><span className="font-medium text-muted-foreground">Employé:</span> {empName(viewing.employee)}</div>
              <div><span className="font-medium text-muted-foreground">Type:</span> {CONTRACT_TYPES.find((t) => t.value === viewing.type)?.label || viewing.type}</div>
              <div><span className="font-medium text-muted-foreground">Statut:</span> {statusBadge(viewing.status)}</div>
              <div><span className="font-medium text-muted-foreground">Début:</span> {viewing.startDate ? new Date(viewing.startDate).toLocaleDateString() : "—"}</div>
              <div><span className="font-medium text-muted-foreground">Fin:</span> {viewing.endDate ? new Date(viewing.endDate).toLocaleDateString() : "—"}</div>
              <div><span className="font-medium text-muted-foreground">Salaire:</span> {viewing.salary || 0} {viewing.currency || "CDF"}</div>
              <div className="col-span-2"><span className="font-medium text-muted-foreground">Notes:</span> {viewing.notes || "—"}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
