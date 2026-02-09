import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { attendanceApi, employeeApi } from "../../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

interface AttendanceFormValues {
  employee: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  notes: string;
}

interface AttendanceItem {
  _id: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  status: string;
  notes?: string;
  createdAt: string;
}

interface EmpLookup { _id: string; firstName: string; lastName: string }

const STATUS_OPTIONS = [
  { value: "present", label: "Présent" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "En retard" },
  { value: "half_day", label: "Demi-journée" },
  { value: "remote", label: "Télétravail" },
];

const schema = Yup.object({
  employee: Yup.string().required("L'employé est requis"),
  date: Yup.string().required("La date est requise"),
  checkInTime: Yup.string(),
  checkOutTime: Yup.string(),
  status: Yup.string().required("Le statut est requis"),
  notes: Yup.string(),
});

const INITIAL: AttendanceFormValues = { employee: "", date: "", checkInTime: "", checkOutTime: "", status: "present", notes: "" };

export default function AttendancePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceItem | null>(null);
  const qc = useQueryClient();

  const { data: aData, isLoading } = useQuery({ queryKey: ["attendance"], queryFn: async () => (await attendanceApi.getAll()).data });
  const attendances: AttendanceItem[] = aData?.data || [];

  const { data: empData } = useQuery({ queryKey: ["employees-lookup"], queryFn: async () => (await employeeApi.getAll()).data });
  const employees: EmpLookup[] = empData?.data || [];

  const mutation = useMutation({
    mutationFn: async (v: AttendanceFormValues) => editing ? await attendanceApi.update(editing._id, v) : await attendanceApi.create(v),
    onSuccess: () => { Swal.fire("Succès!", `La présence a été ${editing ? "modifiée" : "enregistrée"}.`, "success"); qc.invalidateQueries({ queryKey: ["attendance"] }); closeDialog(); },
    onError: (e: any) => Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await attendanceApi.delete(id),
    onSuccess: () => { Swal.fire("Supprimé!", "Enregistrement supprimé.", "success"); qc.invalidateQueries({ queryKey: ["attendance"] }); },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<AttendanceFormValues>({ initialValues: INITIAL, validationSchema: schema, onSubmit: (v) => mutation.mutateAsync(v) });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        employee: editing.employee?._id || "", date: editing.date ? editing.date.slice(0, 10) : "",
        checkInTime: editing.checkInTime || "", checkOutTime: editing.checkOutTime || "",
        status: editing.status || "present", notes: editing.notes || "",
      });
    } else formik.resetForm();
  }, [editing]);

  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const empName = (e?: AttendanceItem["employee"]) => e ? (e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim()) : "—";
  const handleDelete = (id: string) => {
    Swal.fire({ title: "Êtes-vous sûr?", text: "Cette action est irréversible!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!", cancelButtonText: "Annuler" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  const statusBadge = (s: string) => {
    const c: Record<string, string> = { present: "bg-green-100 text-green-700", absent: "bg-red-100 text-red-700", late: "bg-yellow-100 text-yellow-700", half_day: "bg-blue-100 text-blue-700", remote: "bg-purple-100 text-purple-700" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>{STATUS_OPTIONS.find((o) => o.value === s)?.label || s}</span>;
  };

  const columns = [
    { id: "employee", label: "Employé", render: (r: AttendanceItem) => empName(r.employee) },
    { id: "date", label: "Date", render: (r: AttendanceItem) => r.date ? new Date(r.date).toLocaleDateString() : "—" },
    { id: "checkInTime", label: "Arrivée", render: (r: AttendanceItem) => r.checkInTime || "—" },
    { id: "checkOutTime", label: "Départ", render: (r: AttendanceItem) => r.checkOutTime || "—" },
    { id: "totalHours", label: "Heures", render: (r: AttendanceItem) => r.totalHours != null ? `${r.totalHours}h` : "—" },
    { id: "status", label: "Statut", render: (r: AttendanceItem) => statusBadge(r.status) },
    { id: "actions", label: "Actions", render: (r: AttendanceItem) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div><div className="bg-slate-100 p-1 rounded px-2 py-1"><p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Présences</p></div></div>
        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}><Plus color="white" /> Enregistrer une présence</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader><DialogTitle>{editing ? "Modifier la présence" : "Nouvelle présence"}</DialogTitle></DialogHeader>
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
                      <div><Label>Date</Label><Input name="date" type="date" value={formik.values.date} onChange={formik.handleChange} />{formik.touched.date && formik.errors.date && <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>}</div>
                      <div>
                        <Label>Statut</Label>
                        <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue("status", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectGroup>{STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectGroup></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Heure d'arrivée</Label><Input name="checkInTime" type="time" value={formik.values.checkInTime} onChange={formik.handleChange} /></div>
                      <div><Label>Heure de départ</Label><Input name="checkOutTime" type="time" value={formik.values.checkOutTime} onChange={formik.handleChange} /></div>
                    </div>
                    <div><Label>Notes</Label><Input name="notes" value={formik.values.notes} onChange={formik.handleChange} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <div className="text-center py-4">Chargement...</div> : <EnhancedTable columns={columns} data={attendances} />}
        </div>
      </div>
    </div>
  );
}
