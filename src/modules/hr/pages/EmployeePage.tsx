import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { employeeApi, departmentApi, positionApi } from "../api/hr.api";
import EnhancedTable from "@/modules/user/pages/EnhancedTable";

// ─── Types ────────────────────────────────────────────────────
interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  status: string;
  gender: string;
  birthDate: string;
  address: string;
  nationalId: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface EmployeeItem {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  department?: { _id: string; name: string };
  position?: { _id: string; title: string };
  hireDate: string;
  status: string;
  gender: string;
  birthDate?: string;
  address?: string;
  nationalId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt: string;
}

interface DeptItem { _id: string; name: string }
interface PosItem { _id: string; title: string }

// ─── Validation ───────────────────────────────────────────────
const schema = Yup.object({
  firstName: Yup.string().required("Le prénom est requis"),
  lastName: Yup.string().required("Le nom est requis"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  phone: Yup.string().required("Le téléphone est requis"),
  department: Yup.string(),
  position: Yup.string(),
  hireDate: Yup.string().required("La date d'embauche est requise"),
  status: Yup.string().required("Le statut est requis"),
  gender: Yup.string().required("Le genre est requis"),
  birthDate: Yup.string(),
  address: Yup.string(),
  nationalId: Yup.string(),
  emergencyContact: Yup.string(),
  emergencyPhone: Yup.string(),
});

const INITIAL: EmployeeFormValues = {
  firstName: "", lastName: "", email: "", phone: "",
  department: "", position: "", hireDate: "", status: "active",
  gender: "", birthDate: "", address: "", nationalId: "",
  emergencyContact: "", emergencyPhone: "",
};

const STATUS_OPTIONS = [
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "on_leave", label: "En congé" },
  { value: "probation", label: "Période d'essai" },
  { value: "terminated", label: "Résilié" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Masculin" },
  { value: "female", label: "Féminin" },
  { value: "other", label: "Autre" },
];

// ─── Component ────────────────────────────────────────────────
export default function EmployeePage() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeItem | null>(null);
  const [viewing, setViewing] = useState<EmployeeItem | null>(null);
  const qc = useQueryClient();

  // ── Queries ───────────────────────────────────────────────
  const { data: empData, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees: EmployeeItem[] = empData?.data || [];

  const { data: deptData } = useQuery({
    queryKey: ["departments-lookup"],
    queryFn: async () => (await departmentApi.getAll()).data,
  });
  const departments: DeptItem[] = deptData?.data || [];

  const { data: posData } = useQuery({
    queryKey: ["positions-lookup"],
    queryFn: async () => (await positionApi.getAll()).data,
  });
  const positions: PosItem[] = posData?.data || [];

  // ── Mutations ─────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      return editing
        ? await employeeApi.update(editing._id, values)
        : await employeeApi.create(values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", `L'employé a été ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["employees"] });
      closeDialog();
    },
    onError: (err: any) => {
      Swal.fire("Erreur!", err.response?.data?.message || "Une erreur est survenue.", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await employeeApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "L'employé a été supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  // ── Form ──────────────────────────────────────────────────
  const formik = useFormik<EmployeeFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        firstName: editing.firstName || "",
        lastName: editing.lastName || "",
        email: editing.email || "",
        phone: editing.phone || "",
        department: editing.department?._id || "",
        position: editing.position?._id || "",
        hireDate: editing.hireDate ? editing.hireDate.slice(0, 10) : "",
        status: editing.status || "active",
        gender: editing.gender || "",
        birthDate: editing.birthDate ? editing.birthDate.slice(0, 10) : "",
        address: editing.address || "",
        nationalId: editing.nationalId || "",
        emergencyContact: editing.emergencyContact || "",
        emergencyPhone: editing.emergencyPhone || "",
      });
    } else {
      formik.resetForm();
    }
  }, [editing]);

  // ── Handlers ──────────────────────────────────────────────
  const closeDialog = () => { setOpen(false); setEditing(null); formik.resetForm(); };
  const handleEdit = (e: EmployeeItem) => { setEditing(e); setOpen(true); };
  const handleView = (e: EmployeeItem) => { setViewing(e); setViewOpen(true); };
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Êtes-vous sûr?", text: "Cette action est irréversible!",
      icon: "warning", showCancelButton: true, confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6", confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  // ── Table columns ─────────────────────────────────────────
  const columns = [
    { id: "firstName", label: "Prénom" },
    { id: "lastName", label: "Nom" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Téléphone" },
    {
      id: "department", label: "Département",
      render: (r: EmployeeItem) => r.department?.name || "—",
    },
    {
      id: "position", label: "Poste",
      render: (r: EmployeeItem) => r.position?.title || "—",
    },
    {
      id: "status", label: "Statut",
      render: (r: EmployeeItem) => {
        const c: Record<string, string> = {
          active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-700",
          on_leave: "bg-yellow-100 text-yellow-700", probation: "bg-blue-100 text-blue-700",
          terminated: "bg-red-100 text-red-700",
        };
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[r.status] || ""}`}>
            {STATUS_OPTIONS.find((s) => s.value === r.status)?.label || r.status}
          </span>
        );
      },
    },
    {
      id: "actions", label: "Actions",
      render: (r: EmployeeItem) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleView(r)}><Eye className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => handleEdit(r)}><Pencil className="h-4 w-4" /></Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  // ── Field helper ──────────────────────────────────────────
  const Field = ({ name, label, type = "text" }: { name: keyof EmployeeFormValues; label: string; type?: string }) => (
    <div>
      <Label>{label}</Label>
      <Input name={name} type={type} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
      {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>}
    </div>
  );

  // ── JSX ───────────────────────────────────────────────────
  return (
    <div>
      <div className="bg-white py-2 px-3 h-full border rounded-md">
        <div>
          <div className="bg-slate-100 p-1 rounded px-2 py-1">
            <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Employés</p>
          </div>
        </div>

        <div className="rounded-md my-4 p-2">
          <div className="flex justify-end mb-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditing(null)}>
                  <Plus color="white" /> Ajouter un employé
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <form onSubmit={formik.handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editing ? "Modifier l'employé" : "Nouvel employé"}</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <Field name="firstName" label="Prénom" />
                    <Field name="lastName" label="Nom" />
                    <Field name="email" label="Email" type="email" />
                    <Field name="phone" label="Téléphone" />

                    <div>
                      <Label>Genre</Label>
                      <Select value={formik.values.gender} onValueChange={(v) => formik.setFieldValue("gender", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>
                          {GENDER_OPTIONS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                        </SelectGroup></SelectContent>
                      </Select>
                    </div>

                    <Field name="birthDate" label="Date de naissance" type="date" />

                    <div>
                      <Label>Département</Label>
                      <Select value={formik.values.department} onValueChange={(v) => formik.setFieldValue("department", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>
                          {departments.map((d) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                        </SelectGroup></SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Poste</Label>
                      <Select value={formik.values.position} onValueChange={(v) => formik.setFieldValue("position", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>
                          {positions.map((p) => <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>)}
                        </SelectGroup></SelectContent>
                      </Select>
                    </div>

                    <Field name="hireDate" label="Date d'embauche" type="date" />

                    <div>
                      <Label>Statut</Label>
                      <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue("status", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent><SelectGroup>
                          {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectGroup></SelectContent>
                      </Select>
                    </div>

                    <Field name="nationalId" label="N° Carte d'identité" />
                    <div className="col-span-2"><Field name="address" label="Adresse" /></div>

                    <Field name="emergencyContact" label="Contact d'urgence" />
                    <Field name="emergencyPhone" label="Tél. urgence" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                    <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>
                      {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <EnhancedTable columns={columns} data={employees} />
          )}
        </div>
      </div>

      {/* View dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Détails de l'employé</DialogTitle></DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm py-2">
              <div><span className="font-medium text-muted-foreground">Prénom:</span> {viewing.firstName}</div>
              <div><span className="font-medium text-muted-foreground">Nom:</span> {viewing.lastName}</div>
              <div><span className="font-medium text-muted-foreground">Email:</span> {viewing.email}</div>
              <div><span className="font-medium text-muted-foreground">Téléphone:</span> {viewing.phone}</div>
              <div><span className="font-medium text-muted-foreground">Département:</span> {viewing.department?.name || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Poste:</span> {viewing.position?.title || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Statut:</span> {STATUS_OPTIONS.find((s) => s.value === viewing.status)?.label || viewing.status}</div>
              <div><span className="font-medium text-muted-foreground">Genre:</span> {GENDER_OPTIONS.find((g) => g.value === viewing.gender)?.label || viewing.gender}</div>
              <div><span className="font-medium text-muted-foreground">Date d'embauche:</span> {viewing.hireDate ? new Date(viewing.hireDate).toLocaleDateString() : "—"}</div>
              <div><span className="font-medium text-muted-foreground">N° ID:</span> {viewing.nationalId || "—"}</div>
              <div className="col-span-2"><span className="font-medium text-muted-foreground">Adresse:</span> {viewing.address || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Urgence:</span> {viewing.emergencyContact || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Tél. urgence:</span> {viewing.emergencyPhone || "—"}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
