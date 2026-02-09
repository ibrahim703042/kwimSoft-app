import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { departmentApi, employeeApi } from "../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

// ─── Types ────────────────────────────────────────────────────
interface DeptFormValues {
  name: string;
  code: string;
  description: string;
  manager: string;
  parentDepartment: string;
}

interface DeptItem {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  manager?: { _id: string; fullName: string; firstName?: string; lastName?: string };
  parentDepartment?: { _id: string; name: string };
  employeeCount?: number;
  isActive?: boolean;
  createdAt: string;
}

interface EmpLookup { _id: string; firstName: string; lastName: string }

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  code: Yup.string().required("Le code est requis"),
  description: Yup.string(),
  manager: Yup.string(),
  parentDepartment: Yup.string(),
});

const INITIAL: DeptFormValues = { name: "", code: "", description: "", manager: "", parentDepartment: "" };

export default function DepartmentPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeptItem | null>(null);
  const qc = useQueryClient();

  const { data: deptData, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await departmentApi.getAll()).data,
  });
  const departments: DeptItem[] = deptData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employeeLookup: EmpLookup[] = empData?.data || [];

  const mutation = useMutation({
    mutationFn: async (values: DeptFormValues) =>
      editing ? await departmentApi.update(editing._id, values) : await departmentApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", `Le département a été ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["departments"] });
      closeDialog();
    },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await departmentApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Département supprimé.", "success"); qc.invalidateQueries({ queryKey: ["departments"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<DeptFormValues>({
    initialValues: INITIAL, validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        name: editing.name || "", code: editing.code || "",
        description: editing.description || "",
        manager: editing.manager?._id || "",
        parentDepartment: editing.parentDepartment?._id || "",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const columns = [
    { id: "name", label: "Nom" },
    { id: "code", label: "Code" },
    { id: "manager", label: "Responsable", render: (r: DeptItem) => {
      if (!r.manager) return "—";
      return r.manager.fullName || `${r.manager.firstName || ""} ${r.manager.lastName || ""}`.trim() || "—";
    }},
    { id: "employeeCount", label: "Employés", render: (r: DeptItem) => <span>{r.employeeCount || 0}</span> },
    { id: "parentDepartment", label: "Département parent", render: (r: DeptItem) => r.parentDepartment?.name || "—" },
    { id: "actions", label: "Actions", render: (r: DeptItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Départements</p></div></div>

        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}>
                  <Plus color="white" /> Ajouter un département
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier le département" : "Nouveau département"}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nom</Label>
                        <Input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>}
                      </div>
                      <div>
                        <Label>Code</Label>
                        <Input name="code" value={formik.values.code} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.code && formik.errors.code && <p className="text-red-500 text-xs mt-1">{formik.errors.code}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows={3} />
                    </div>
                    <div>
                      <Label>Responsable</Label>
                      <Select value={formik.values.manager} onValueChange={(v) => formik.setFieldValue("manager", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>
                          {employeeLookup.map((e) => <SelectItem key={e._id} value={e._id}>{e.firstName} {e.lastName}</SelectItem>)}
                        </SelectGroup></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Département parent</Label>
                      <Select value={formik.values.parentDepartment} onValueChange={(v) => formik.setFieldValue("parentDepartment", v)}>
                        <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                        <SelectContent><SelectGroup>
                          {departments.filter((d) => d._id !== editing?._id).map((d) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                        </SelectGroup></SelectContent>
                      </Select>
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
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={departments} />}
        </div>
      </div>
    </div>
  );
}
