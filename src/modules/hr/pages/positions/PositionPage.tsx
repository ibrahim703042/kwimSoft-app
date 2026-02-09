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
import { positionApi, departmentApi } from "../../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface PosFormValues {
  title: string;
  code: string;
  department: string;
  level: string;
  description: string;
  minSalary: string;
  maxSalary: string;
}

interface PosItem {
  _id: string;
  title: string;
  code?: string;
  department?: { _id: string; name: string };
  level?: string;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  isActive?: boolean;
  createdAt: string;
}

interface DeptLookup { _id: string; name: string }

const schema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  code: Yup.string().required("Le code est requis"),
  department: Yup.string(),
  level: Yup.string(),
  description: Yup.string(),
  minSalary: Yup.string(),
  maxSalary: Yup.string(),
});

const INITIAL: PosFormValues = { title: "", code: "", department: "", level: "", description: "", minSalary: "", maxSalary: "" };

const LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Intermédiaire" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Directeur" },
];

export default function PositionPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PosItem | null>(null);
  const qc = useQueryClient();

  const { data: posData, isLoading } = useQuery({
    queryKey: ["positions"], queryFn: async () => (await positionApi.getAll()).data,
  });
  const positions: PosItem[] = posData?.data || [];

  const { data: deptData } = useQuery({
    queryKey: ["departments-lookup"], queryFn: async () => (await departmentApi.getAll()).data,
  });
  const departments: DeptLookup[] = deptData?.data || [];

  const mutation = useMutation({
    mutationFn: async (values: PosFormValues) =>
      editing ? await positionApi.update(editing._id, values) : await positionApi.create(values),
    onSuccess: () => { Swal.fire("Succès!", `Le poste a été ${editing ? "modifié" : "créé"}.`, "success"); qc.invalidateQueries({ queryKey: ["positions"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await positionApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Poste supprimé.", "success"); qc.invalidateQueries({ queryKey: ["positions"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<PosFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        title: editing.title || "", code: editing.code || "",
        department: editing.department?._id || "", level: editing.level || "",
        description: editing.description || "",
        minSalary: editing.minSalary?.toString() || "", maxSalary: editing.maxSalary?.toString() || "",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const columns = [
    { id: "title", label: "Titre" },
    { id: "code", label: "Code" },
    { id: "department", label: "Département", render: (r: PosItem) => r.department?.name || "—" },
    { id: "level", label: "Niveau", render: (r: PosItem) => LEVELS.find((l) => l.value === r.level)?.label || r.level || "—" },
    { id: "salary", label: "Fourchette salariale", render: (r: PosItem) => r.minSalary || r.maxSalary ? `${r.minSalary || "?"} – ${r.maxSalary || "?"}` : "—" },
    { id: "actions", label: "Actions", render: (r: PosItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Postes</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Ajouter un poste</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier le poste" : "Nouveau poste"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Titre</Label><Input name="title" value={formik.values.title} onChange={formik.handleChange} />{formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>}</div>
                      <div><Label>Code</Label><Input name="code" value={formik.values.code} onChange={formik.handleChange} />{formik.touched.code && formik.errors.code && <p className="text-red-500 text-xs mt-1">{formik.errors.code}</p>}</div>
                    </div>
                    <div>
                      <Label>Département</Label>
                      <Select value={formik.values.department} onValueChange={(v) => formik.setFieldValue("department", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>{departments.map((d) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Niveau</Label>
                      <Select value={formik.values.level} onValueChange={(v) => formik.setFieldValue("level", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>{LEVELS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div><Label>Description</Label><Textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows={3} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Salaire min</Label><Input name="minSalary" type="number" value={formik.values.minSalary} onChange={formik.handleChange} /></div>
                      <div><Label>Salaire max</Label><Input name="maxSalary" type="number" value={formik.values.maxSalary} onChange={formik.handleChange} /></div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={positions} />}
        </div>
      </div>
    </div>
  );
}
