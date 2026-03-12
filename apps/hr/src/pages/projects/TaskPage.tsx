/**
 * TaskPage - Task management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CheckSquare } from "lucide-react";
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
import { taskApi, projectApi, employeeApi } from "../../api/hr.api";

interface TaskFormValues {
  title: string;
  description: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  estimatedHours: number;
}

interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  project?: { _id: string; name: string };
  assignee?: { _id: string; firstName?: string; lastName?: string };
  status: string;
  priority?: string;
  dueDate?: string;
  estimatedHours?: number;
  createdAt: string;
}

const statuses = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "in_review", label: "En révision" },
  { value: "completed", label: "Terminé" },
  { value: "blocked", label: "Bloqué" },
  { value: "cancelled", label: "Annulé" },
];

const priorities = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

const schema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string(),
  project: Yup.string(),
  assignee: Yup.string(),
  status: Yup.string(),
  priority: Yup.string(),
  dueDate: Yup.string(),
  estimatedHours: Yup.number().min(0),
});

const INITIAL: TaskFormValues = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  estimatedHours: 0,
};

const statusColors: Record<string, string> = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  in_review: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export default function TaskPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const qc = useQueryClient();

  const { data: taskData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await taskApi.getAll()).data,
  });
  const tasks: TaskItem[] = taskData?.data || taskData?.content || [];

  const { data: projectData } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await projectApi.getAll()).data,
  });
  const projects = projectData?.data || projectData?.content || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || empData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: TaskFormValues) =>
      editing
        ? await taskApi.update(editing._id, values)
        : await taskApi.create(values),
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `La tâche a été ${editing ? "modifiée" : "créée"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["tasks"] });
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
    mutationFn: async (id: string) => await taskApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Tâche supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<TaskFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        title: editing.title || "",
        description: editing.description || "",
        project: editing.project?._id || "",
        assignee: editing.assignee?._id || "",
        status: editing.status || "todo",
        priority: editing.priority || "medium",
        dueDate: editing.dueDate?.split("T")[0] || "",
        estimatedHours: editing.estimatedHours || 0,
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
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "project",
      header: "Projet",
      cell: ({ row }: any) => row.original.project?.name || "—",
    },
    {
      accessorKey: "assignee",
      header: "Assigné à",
      cell: ({ row }: any) => {
        const a = row.original.assignee;
        return a ? `${a.firstName || ""} ${a.lastName || ""}`.trim() : "—";
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
      accessorKey: "priority",
      header: "Priorité",
      cell: ({ row }: any) =>
        priorities.find((p) => p.value === row.original.priority)?.label || row.original.priority,
    },
    {
      accessorKey: "dueDate",
      header: "Échéance",
      cell: ({ row }: any) =>
        row.original.dueDate
          ? new Date(row.original.dueDate).toLocaleDateString("fr-FR")
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
          <h2 className="text-xl font-semibold">Tâches</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les tâches des projets
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-4 w-4 mr-2" /> Nouvelle tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier la tâche" : "Nouvelle tâche"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Projet</Label>
                    <Select
                      value={formik.values.project}
                      onValueChange={(v) => formik.setFieldValue("project", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {projects.map((p: any) => (
                            <SelectItem key={p._id} value={p._id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Assigné à</Label>
                    <Select
                      value={formik.values.assignee}
                      onValueChange={(v) => formik.setFieldValue("assignee", v)}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Échéance</Label>
                    <Input
                      name="dueDate"
                      type="date"
                      value={formik.values.dueDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Heures estimées</Label>
                    <Input
                      name="estimatedHours"
                      type="number"
                      value={formik.values.estimatedHours}
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
          data={tasks}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
