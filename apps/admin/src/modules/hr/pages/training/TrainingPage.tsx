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
import { trainingApi } from "../../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface TrainingFormValues {
  title: string;
  type: string;
  trainer: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: string;
  status: string;
  description: string;
}

interface TrainingItem {
  _id: string;
  title: string;
  type?: string;
  trainer?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  maxParticipants?: number;
  participantCount?: number;
  status: string;
  description?: string;
  createdAt: string;
}

const TRAINING_TYPES = [
  { value: "internal", label: "Interne" },
  { value: "external", label: "Externe" },
  { value: "online", label: "En ligne" },
  { value: "workshop", label: "Atelier" },
  { value: "certification", label: "Certification" },
];

const STATUS_OPTIONS = [
  { value: "planned", label: "Planifié" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

const schema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  type: Yup.string().required("Le type est requis"),
  trainer: Yup.string(),
  startDate: Yup.string().required("La date de début est requise"),
  endDate: Yup.string(),
  location: Yup.string(),
  maxParticipants: Yup.string(),
  status: Yup.string().required("Le statut est requis"),
  description: Yup.string(),
});

const INITIAL: TrainingFormValues = { title: "", type: "internal", trainer: "", startDate: "", endDate: "", location: "", maxParticipants: "", status: "planned", description: "" };

export default function TrainingPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TrainingItem | null>(null);
  const qc = useQueryClient();

  const { data: tData, isLoading } = useQuery({ queryKey: ["trainings"], queryFn: async () => (await trainingApi.getAll()).data });
  const trainings: TrainingItem[] = tData?.data || [];

  const mutation = useMutation({
    mutationFn: async (v: TrainingFormValues) => editing ? await trainingApi.update(editing._id, v) : await trainingApi.create(v),
    onSuccess: () => { Swal.fire("Succès!", `La formation a été ${editing ? "modifiée" : "créée"}.`, "success"); qc.invalidateQueries({ queryKey: ["trainings"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await trainingApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Formation supprimée.", "success"); qc.invalidateQueries({ queryKey: ["trainings"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<TrainingFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        title: editing.title || "", type: editing.type || "internal",
        trainer: editing.trainer || "",
        startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
        location: editing.location || "",
        maxParticipants: editing.maxParticipants?.toString() || "",
        status: editing.status || "planned", description: editing.description || "",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const statusBadge = (s: string) => {
    const c: Record<string, string> = { 
      planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", 
      in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", 
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", 
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>{STATUS_OPTIONS.find((o) => o.value === s)?.label || s}</span>;
  };

  const columns = [
    { id: "title", label: "Titre" },
    { id: "type", label: "Type", render: (r: TrainingItem) => TRAINING_TYPES.find((t) => t.value === r.type)?.label || r.type || "—" },
    { id: "trainer", label: "Formateur" },
    { id: "startDate", label: "Début", render: (r: TrainingItem) => r.startDate ? new Date(r.startDate).toLocaleDateString() : "—" },
    { id: "participants", label: "Participants", render: (r: TrainingItem) => `${r.participantCount || 0}${r.maxParticipants ? ` / ${r.maxParticipants}` : ""}` },
    { id: "status", label: "Statut", render: (r: TrainingItem) => statusBadge(r.status) },
    { id: "actions", label: "Actions", render: (r: TrainingItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Formations</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Nouvelle formation</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div><Label>Titre</Label><Input name="title" value={formik.values.title} onChange={formik.handleChange} />{formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={formik.values.type} onValueChange={(v) => formik.setFieldValue("type", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectGroup>{TRAINING_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                      <div><Label>Formateur</Label><Input name="trainer" value={formik.values.trainer} onChange={formik.handleChange} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Début</Label><Input name="startDate" type="date" value={formik.values.startDate} onChange={formik.handleChange} />{formik.touched.startDate && formik.errors.startDate && <p className="text-red-500 text-xs mt-1">{formik.errors.startDate}</p>}</div>
                      <div><Label>Fin</Label><Input name="endDate" type="date" value={formik.values.endDate} onChange={formik.handleChange} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Lieu</Label><Input name="location" value={formik.values.location} onChange={formik.handleChange} /></div>
                      <div><Label>Max participants</Label><Input name="maxParticipants" type="number" value={formik.values.maxParticipants} onChange={formik.handleChange} /></div>
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue("status", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectGroup>{STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div><Label>Description</Label><Textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows={3} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={trainings} />}
        </div>
      </div>
    </div>
  );
}
