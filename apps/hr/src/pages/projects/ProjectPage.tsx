/**
 * ProjectPage - Project management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kwim/shared-ui";
import { CrudTable } from "@kwim/core";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { projectApi, clientApi, employeeApi } from "../../api/hr.api";

interface ProjectFormValues {
  name: string;
  code: string;
  description: string;
  client: string;
  manager: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: number;
}

interface ProjectItem {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  client?: { _id: string; name: string };
  manager?: { _id: string; firstName?: string; lastName?: string };
  status: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  createdAt: string;
}

const statuses = [
  { value: "planning", label: "Planification" },
  { value: "in_progress", label: "En cours" },
  { value: "on_hold", label: "En attente" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

const priorities = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
  { value: "critical", label: "Critique" },
];

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  code: Yup.string(),
  description: Yup.string(),
  client: Yup.string(),
  manager: Yup.string(),
  status: Yup.string(),
  priority: Yup.string(),
  startDate: Yup.string(),
  endDate: Yup.string(),
  budget: Yup.number().min(0),
});

const INITIAL: ProjectFormValues = {
  name: "",
  code: "",
  description: "",
  client: "",
  manager: "",
  status: "planning",
  priority: "medium",
  startDate: "",
  endDate: "",
  budget: 0,
};

const statusColors: Record<string, string> = {
  planning: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function ProjectPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const qc = useQueryClient();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await projectApi.getAll()).data,
  });
  const projects: ProjectItem[] = projectData?.data || projectData?.content || [];

  const { data: clientData } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => (await clientApi.getAll()).data,
  });
  const clients = clientData?.data || clientData?.content || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || empData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormValues) =>
      editing
        ? await projectApi.update(editing._id, values)
        : await projectApi.create(values),
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `Le projet a été ${editing ? "modifié" : "créé"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["projects"] });
      closeDialog();
    },
    onError: (e: any) =>
      Swal.fire(
        "Erreur!",
        e.response?.data?.message || "Une erreur est survenue.",
        "error"
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await projectApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Projet supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<ProjectFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        name: editing.name || "",
        code: editing.code || "",
        description: editing.description || "",
        client: editing.client?._id || "",
        manager: editing.manager?._id || "",
        status: editing.status || "planning",
        priority: editing.priority || "medium",
        startDate: editing.startDate?.split("T")[0] || "",
        endDate: editing.endDate?.split("T")[0] || "",
        budget: editing.budget || 0,
      });
    } else {
      formik.resetForm();
    }
  }, [editing]);

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    formik.resetForm();
  };

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

  const columns = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "code", header: "Code" },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }: any) => row.original.client?.name || "—",
    },
    {
      accessorKey: "manager",
      header: "Responsable",
      cell: ({ row }: any) => {
        const m = row.original.manager;
        return m ? `${m.firstName || ""} ${m.lastName || ""}`.trim() : "—";
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            statusColors[row.original.status] || "bg-gray-100"
          }`}
        >
          {statuses.find((s) => s.value === row.original.status)?.label || row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "endDate",
      header: "Échéance",
      cell: ({ row }: any) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString("fr-FR")
          : "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditing(row.original);
              setOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Projets</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les projets de l'entreprise
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-4 w-4 mr-2" /> Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier le projet" : "Nouveau projet"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom</Label>
                    <Input
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label>Code</Label>
                    <Input
                      name="code"
                      value={formik.values.code}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Client</Label>
                    <Select
                      value={formik.values.client}
                      onValueChange={(v) => formik.setFieldValue("client", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {clients.map((c: any) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Chef de projet</Label>
                    <Select
                      value={formik.values.manager}
                      onValueChange={(v) => formik.setFieldValue("manager", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {employees.map((e: any) => (
                            <SelectItem key={e._id} value={e._id}>
                              {e.firstName} {e.lastName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Statut</Label>
                    <Select
                      value={formik.values.status}
                      onValueChange={(v) => formik.setFieldValue("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {statuses.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priorité</Label>
                    <Select
                      value={formik.values.priority}
                      onValueChange={(v) => formik.setFieldValue("priority", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {priorities.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date de début</Label>
                    <Input
                      name="startDate"
                      type="date"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Date de fin</Label>
                    <Input
                      name="endDate"
                      type="date"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <Input
                      name="budget"
                      type="number"
                      value={formik.values.budget}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Annuler
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <CrudTable
          data={projects}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
