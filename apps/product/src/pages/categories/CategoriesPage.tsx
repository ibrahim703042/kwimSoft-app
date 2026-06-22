import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import { CrudPage } from "@kwim/core";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@kwim/shared-ui";
import { categoryApi, type CategoryData } from "../../api/product.api";

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  description: Yup.string(),
});

interface CategoryFormValues {
  name: string;
  description: string;
}

const INITIAL: CategoryFormValues = { name: "", description: "" };

const columns: ColumnDef<CategoryData>[] = [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "description", header: "Description" },
];

interface CategoryDialogProps {
  readonly editing: CategoryData | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

function CategoryDialog({ editing, open, onOpenChange }: CategoryDialogProps) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      editing ? categoryApi.update(editing._id, values) : categoryApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", `Catégorie ${editing ? "modifiée" : "créée"}.`, "success");
      qc.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
    onError: () => Swal.fire("Erreur!", "Une erreur est survenue.", "error"),
  });

  const formik = useFormik<CategoryFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (values) => mutation.mutate(values),
  });

  useEffect(() => {
    if (open) {
      formik.resetForm({
        values: editing
          ? { name: editing.name ?? "", description: editing.description ?? "" }
          : INITIAL,
      });
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input name="name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.touched.name && formik.errors.name && (
              <p className="text-destructive text-xs mt-1">{formik.errors.name}</p>
            )}
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
          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {editing ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesPage() {
  const [editing, setEditing] = useState<CategoryData | null>(null);
  const [open, setOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (row: CategoryData) => {
    setEditing(row);
    setOpen(true);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setEditing(null);
  };

  return (
    <>
      <CrudPage
        config={{
          title: "Catégories",
          queryKey: ["categories"],
          queryFn: categoryApi.list,
          columns,
          deleteFn: async (id) => {
            await categoryApi.delete(id);
          },
        }}
        addButton={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        }
        onEdit={handleEdit}
      />

      <CategoryDialog editing={editing} open={open} onOpenChange={handleOpenChange} />
    </>
  );
}
