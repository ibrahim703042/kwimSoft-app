/**
 * LoanTypePage - Loan Type management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  Checkbox,
} from "@kwim/shared-ui";
import { CrudTable } from "@kwim/core";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { loanTypeApi } from "../../api/hr.api";

interface LoanTypeFormValues {
  name: string;
  description: string;
  interestRate: number;
  maxAmount: number;
  minAmount: number;
  maxTenureMonths: number;
  minTenureMonths: number;
  isActive: boolean;
  requiresApproval: boolean;
}

interface LoanTypeItem {
  _id: string;
  name: string;
  description?: string;
  interestRate?: number;
  maxAmount?: number;
  minAmount?: number;
  maxTenureMonths?: number;
  minTenureMonths?: number;
  isActive?: boolean;
  requiresApproval?: boolean;
  createdAt: string;
}

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  description: Yup.string(),
  interestRate: Yup.number().min(0, "Doit être positif"),
  maxAmount: Yup.number().min(0, "Doit être positif"),
  minAmount: Yup.number().min(0, "Doit être positif"),
  maxTenureMonths: Yup.number().min(1, "Minimum 1 mois"),
  minTenureMonths: Yup.number().min(1, "Minimum 1 mois"),
  isActive: Yup.boolean(),
  requiresApproval: Yup.boolean(),
});

const INITIAL: LoanTypeFormValues = {
  name: "",
  description: "",
  interestRate: 0,
  maxAmount: 0,
  minAmount: 0,
  maxTenureMonths: 12,
  minTenureMonths: 1,
  isActive: true,
  requiresApproval: true,
};

export default function LoanTypePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LoanTypeItem | null>(null);
  const qc = useQueryClient();

  const { data: loanTypeData, isLoading } = useQuery({
    queryKey: ["loan-types"],
    queryFn: async () => (await loanTypeApi.getAll()).data,
  });
  const loanTypes: LoanTypeItem[] = loanTypeData?.data || loanTypeData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: LoanTypeFormValues) =>
      editing
        ? await loanTypeApi.update(editing._id, values)
        : await loanTypeApi.create(values),
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `Le type de prêt a été ${editing ? "modifié" : "créé"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["loan-types"] });
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
    mutationFn: async (id: string) => await loanTypeApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Type de prêt supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["loan-types"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<LoanTypeFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        name: editing.name || "",
        description: editing.description || "",
        interestRate: editing.interestRate || 0,
        maxAmount: editing.maxAmount || 0,
        minAmount: editing.minAmount || 0,
        maxTenureMonths: editing.maxTenureMonths || 12,
        minTenureMonths: editing.minTenureMonths || 1,
        isActive: editing.isActive ?? true,
        requiresApproval: editing.requiresApproval ?? true,
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
    { accessorKey: "name", header: "Nom" },
    {
      accessorKey: "interestRate",
      header: "Taux d'intérêt (%)",
      cell: ({ row }: any) => `${row.original.interestRate || 0}%`,
    },
    {
      accessorKey: "maxAmount",
      header: "Montant Max",
      cell: ({ row }: any) =>
        row.original.maxAmount?.toLocaleString() || "—",
    },
    {
      accessorKey: "maxTenureMonths",
      header: "Durée Max (mois)",
      cell: ({ row }: any) => row.original.maxTenureMonths || "—",
    },
    {
      accessorKey: "isActive",
      header: "Actif",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.isActive ? "Oui" : "Non"}
        </span>
      ),
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
          <h2 className="text-xl font-semibold">Types de Prêt</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les types de prêts disponibles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier le type de prêt" : "Nouveau type de prêt"}
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
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label>Taux d'intérêt (%)</Label>
                    <Input
                      name="interestRate"
                      type="number"
                      step="0.1"
                      value={formik.values.interestRate}
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
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Montant minimum</Label>
                    <Input
                      name="minAmount"
                      type="number"
                      value={formik.values.minAmount}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Montant maximum</Label>
                    <Input
                      name="maxAmount"
                      type="number"
                      value={formik.values.maxAmount}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Durée minimum (mois)</Label>
                    <Input
                      name="minTenureMonths"
                      type="number"
                      value={formik.values.minTenureMonths}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Durée maximum (mois)</Label>
                    <Input
                      name="maxTenureMonths"
                      type="number"
                      value={formik.values.maxTenureMonths}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formik.values.isActive}
                      onCheckedChange={(v) => formik.setFieldValue("isActive", v)}
                    />
                    <Label htmlFor="isActive">Actif</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requiresApproval"
                      checked={formik.values.requiresApproval}
                      onCheckedChange={(v) => formik.setFieldValue("requiresApproval", v)}
                    />
                    <Label htmlFor="requiresApproval">Nécessite approbation</Label>
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
          data={loanTypes}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
