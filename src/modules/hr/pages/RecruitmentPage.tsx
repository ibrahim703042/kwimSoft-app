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
import { recruitmentApi, departmentApi, positionApi } from "../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface RecruitFormValues {
  title: string;
  department: string;
  position: string;
  description: string;
  requirements: string;
  openDate: string;
  closeDate: string;
  status: string;
}

interface RecruitItem {
  _id: string;
  title: string;
  department?: { _id: string; name: string };
  position?: { _id: string; title: string };
  description?: string;
  requirements?: string;
  openDate?: string;
  closeDate?: string;
  applicationCount?: number;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "open", label: "Ouvert" },
  { value: "in_progress", label: "En cours" },
  { value: "closed", label: "Fermé" },
  { value: "filled", label: "Pourvu" },
];

const schema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  department: Yup.string(),
  position: Yup.string(),
  description: Yup.string(),
  requirements: Yup.string(),
  openDate: Yup.string(),
  closeDate: Yup.string(),
  status: Yup.string().required("Le statut est requis"),
});

const INITIAL: RecruitFormValues = { title: "", department: "", position: "", description: "", requirements: "", openDate: "", closeDate: "", status: "draft" };

export default function RecruitmentPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RecruitItem | null>(null);
  const qc = useQueryClient();

  const { data: rData, isLoading } = useQuery({ queryKey: ["recruitment"], queryFn: async () => (await recruitmentApi.getAll()).data });
  const recruits: RecruitItem[] = rData?.data || [];

  const { data: deptData } = useQuery({ queryKey: ["departments-lookup"], queryFn: async () => (await departmentApi.getAll()).data });
  const departments = deptData?.data || [];

  const { data: posData } = useQuery({ queryKey: ["positions-lookup"], queryFn: async () => (await positionApi.getAll()).data });
  const positions = posData?.data || [];

  const mutation = useMutation({
    mutationFn: async (v: RecruitFormValues) => editing ? await recruitmentApi.update(editing._id, v) : await recruitmentApi.create(v),
    onSuccess: () => { Swal.fire("Succès!", `L'offre a été ${editing ? "modifiée" : "créée"}.`, "success"); qc.invalidateQueries({ queryKey: ["recruitment"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await recruitmentApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Offre supprimée.", "success"); qc.invalidateQueries({ queryKey: ["recruitment"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<RecruitFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        title: editing.title || "", department: editing.department?._id || "",
        position: editing.position?._id || "", description: editing.description || "",
        requirements: editing.requirements || "",
        openDate: editing.openDate ? editing.openDate.slice(0, 10) : "",
        closeDate: editing.closeDate ? editing.closeDate.slice(0, 10) : "",
        status: editing.status || "draft",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const statusBadge = (s: string) => {
    const c: Record<string, string> = { draft: "bg-gray-100 text-gray-700", open: "bg-green-100 text-green-700", in_progress: "bg-blue-100 text-blue-700", closed: "bg-red-100 text-red-700", filled: "bg-purple-100 text-purple-700" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>{STATUS_OPTIONS.find((o) => o.value === s)?.label || s}</span>;
  };

  const columns = [
    { id: "title", label: "Titre du poste" },
    { id: "department", label: "Département", render: (r: RecruitItem) => r.department?.name || "—" },
    { id: "position", label: "Poste", render: (r: RecruitItem) => r.position?.title || "—" },
    { id: "applicationCount", label: "Candidatures", render: (r: RecruitItem) => <span>{r.applicationCount || 0}</span> },
    { id: "closeDate", label: "Date limite", render: (r: RecruitItem) => r.closeDate ? new Date(r.closeDate).toLocaleDateString() : "—" },
    { id: "status", label: "Statut", render: (r: RecruitItem) => statusBadge(r.status) },
    { id: "actions", label: "Actions", render: (r: RecruitItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Recrutement</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Nouvelle offre</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier l'offre" : "Nouvelle offre de recrutement"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div><Label>Titre</Label><Input name="title" value={formik.values.title} onChange={formik.handleChange} />{formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Département</Label>
                        <Select value={formik.values.department} onValueChange={(v) => formik.setFieldValue("department", v)}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent><SelectGroup>{departments.map((d: any) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Poste</Label>
                        <Select value={formik.values.position} onValueChange={(v) => formik.setFieldValue("position", v)}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent><SelectGroup>{positions.map((p: any) => <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Date d'ouverture</Label><Input name="openDate" type="date" value={formik.values.openDate} onChange={formik.handleChange} /></div>
                      <div><Label>Date limite</Label><Input name="closeDate" type="date" value={formik.values.closeDate} onChange={formik.handleChange} /></div>
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue("status", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectGroup>{STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div><Label>Description</Label><Textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows={3} /></div>
                    <div><Label>Exigences</Label><Textarea name="requirements" value={formik.values.requirements} onChange={formik.handleChange} rows={3} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={recruits} />}
        </div>
      </div>
    </div>
  );
}
