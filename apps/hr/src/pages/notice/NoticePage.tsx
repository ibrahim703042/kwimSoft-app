/**
 * NoticePage - Notice/Announcement management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Pin } from "lucide-react";
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
  Checkbox,
} from "@kwim/shared-ui";
import { CrudTable } from "@kwim/core";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { noticeApi } from "../../api/hr.api";

interface NoticeFormValues {
  title: string;
  content: string;
  type: string;
  priority: string;
  publishDate: string;
  expiryDate: string;
  isForAllEmployees: boolean;
  isPinned: boolean;
  requiresAcknowledgment: boolean;
  summary: string;
}

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  priority: string;
  publishDate?: string;
  expiryDate?: string;
  isPinned?: boolean;
  isForAllEmployees?: boolean;
  createdAt: string;
}

const noticeTypes = [
  { value: "announcement", label: "Annonce" },
  { value: "policy_update", label: "Mise à jour politique" },
  { value: "event", label: "Événement" },
  { value: "holiday", label: "Jour férié" },
  { value: "urgent", label: "Urgent" },
  { value: "general", label: "Général" },
  { value: "maintenance", label: "Maintenance" },
  { value: "hr_update", label: "Mise à jour RH" },
];

const priorities = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

const schema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  content: Yup.string().required("Le contenu est requis"),
  type: Yup.string(),
  priority: Yup.string(),
  publishDate: Yup.string(),
  expiryDate: Yup.string(),
  isForAllEmployees: Yup.boolean(),
  isPinned: Yup.boolean(),
  requiresAcknowledgment: Yup.boolean(),
  summary: Yup.string(),
});

const INITIAL: NoticeFormValues = {
  title: "",
  content: "",
  type: "general",
  priority: "medium",
  publishDate: "",
  expiryDate: "",
  isForAllEmployees: true,
  isPinned: false,
  requiresAcknowledgment: false,
  summary: "",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-blue-100 text-blue-800",
  expired: "bg-red-100 text-red-800",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export default function NoticePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NoticeItem | null>(null);
  const qc = useQueryClient();

  const { data: noticeData, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => (await noticeApi.getAll()).data,
  });
  const notices: NoticeItem[] = noticeData?.data || noticeData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: NoticeFormValues) =>
      editing
        ? await noticeApi.update(editing._id, values)
        : await noticeApi.create(values),
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `L'annonce a été ${editing ? "modifiée" : "créée"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["notices"] });
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
    mutationFn: async (id: string) => await noticeApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Annonce supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<NoticeFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        title: editing.title || "",
        content: editing.content || "",
        type: editing.type || "general",
        priority: editing.priority || "medium",
        publishDate: editing.publishDate?.split("T")[0] || "",
        expiryDate: editing.expiryDate?.split("T")[0] || "",
        isForAllEmployees: editing.isForAllEmployees ?? true,
        isPinned: editing.isPinned ?? false,
        requiresAcknowledgment: false,
        summary: "",
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
          {row.original.isPinned && <Pin className="h-3 w-3 text-primary" />}
          <span>{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) =>
        noticeTypes.find((t) => t.value === row.original.type)?.label || row.original.type,
    },
    {
      accessorKey: "priority",
      header: "Priorité",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            priorityColors[row.original.priority] || "bg-gray-100"
          }`}
        >
          {priorities.find((p) => p.value === row.original.priority)?.label || row.original.priority}
        </span>
      ),
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
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Créé le",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString("fr-FR"),
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
          <h2 className="text-xl font-semibold">Annonces</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les annonces et communications internes
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-4 w-4 mr-2" /> Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier l'annonce" : "Nouvelle annonce"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={formik.values.type}
                      onValueChange={(v) => formik.setFieldValue("type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {noticeTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
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
                <div>
                  <Label>Contenu</Label>
                  <Textarea
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    rows={6}
                  />
                  {formik.touched.content && formik.errors.content && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date de publication</Label>
                    <Input
                      name="publishDate"
                      type="date"
                      value={formik.values.publishDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Date d'expiration</Label>
                    <Input
                      name="expiryDate"
                      type="date"
                      value={formik.values.expiryDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isForAllEmployees"
                      checked={formik.values.isForAllEmployees}
                      onCheckedChange={(v) => formik.setFieldValue("isForAllEmployees", v)}
                    />
                    <Label htmlFor="isForAllEmployees">Pour tous les employés</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isPinned"
                      checked={formik.values.isPinned}
                      onCheckedChange={(v) => formik.setFieldValue("isPinned", v)}
                    />
                    <Label htmlFor="isPinned">Épingler</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requiresAcknowledgment"
                      checked={formik.values.requiresAcknowledgment}
                      onCheckedChange={(v) => formik.setFieldValue("requiresAcknowledgment", v)}
                    />
                    <Label htmlFor="requiresAcknowledgment">Accusé de réception</Label>
                  </div>
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
          data={notices}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
