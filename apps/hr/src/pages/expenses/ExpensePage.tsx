/**
 * ExpensePage - Expense management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
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
import { expenseApi, employeeApi } from "../../api/hr.api";

interface ExpenseFormValues {
  reference: string;
  employee: string;
  type: string;
  amount: string;
  currency: string;
  date: string;
  description: string;
  status: string;
}

interface ExpenseItem {
  _id: string;
  reference?: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  type?: string;
  amount?: number;
  currency?: string;
  date?: string;
  description?: string;
  status: string;
  approvedBy?: { fullName: string };
  createdAt: string;
}

interface EmpLookup {
  _id: string;
  firstName: string;
  lastName: string;
}

const EXPENSE_TYPES = [
  { value: "transport", label: "Transport" },
  { value: "meal", label: "Repas" },
  { value: "accommodation", label: "Hébergement" },
  { value: "equipment", label: "Équipement" },
  { value: "communication", label: "Communication" },
  { value: "training", label: "Formation" },
  { value: "medical", label: "Médical" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "submitted", label: "Soumis" },
  { value: "approved", label: "Approuvé" },
  { value: "rejected", label: "Rejeté" },
  { value: "paid", label: "Remboursé" },
];

const CURRENCIES = ["CDF", "USD", "EUR"];

const schema = Yup.object({
  reference: Yup.string(),
  employee: Yup.string().required("L'employé est requis"),
  type: Yup.string().required("Le type est requis"),
  amount: Yup.string().required("Le montant est requis"),
  currency: Yup.string().required("La devise est requise"),
  date: Yup.string().required("La date est requise"),
  description: Yup.string(),
  status: Yup.string().required("Le statut est requis"),
});

const INITIAL: ExpenseFormValues = {
  reference: "",
  employee: "",
  type: "transport",
  amount: "",
  currency: "CDF",
  date: "",
  description: "",
  status: "draft",
};

export default function ExpensePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseItem | null>(null);
  const [viewing, setViewing] = useState<ExpenseItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const qc = useQueryClient();

  const { data: eData, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await expenseApi.getAll()).data,
  });
  const expenses: ExpenseItem[] = eData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees: EmpLookup[] = empData?.data || [];

  const mutation = useMutation({
    mutationFn: async (v: ExpenseFormValues) =>
      editing ? await expenseApi.update(editing._id, v) : await expenseApi.create(v),
    onSuccess: () => {
      Swal.fire("Succès!", `La dépense a été ${editing ? "modifiée" : "créée"}.`, "success");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      closeDialog();
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Une erreur est survenue.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await expenseApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Dépense supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<ExpenseFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        reference: editing.reference || "",
        employee: editing.employee?._id || "",
        type: editing.type || "transport",
        amount: editing.amount?.toString() || "",
        currency: editing.currency || "CDF",
        date: editing.date ? editing.date.slice(0, 10) : "",
        description: editing.description || "",
        status: editing.status || "draft",
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

  const empName = (e?: ExpenseItem["employee"]) =>
    e ? e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim() : "—";

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

  const statusBadge = (s: string) => {
    const c: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const columns = [
    { accessorKey: "reference", header: "Réf." },
    {
      accessorKey: "employee",
      header: "Employé",
      cell: ({ row }: any) => empName(row.original.employee),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) =>
        EXPENSE_TYPES.find((t) => t.value === row.original.type)?.label ||
        row.original.type ||
        "—",
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }: any) =>
        `${(row.original.amount || 0).toLocaleString()} ${row.original.currency || "CDF"}`,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) =>
        row.original.date ? new Date(row.original.date).toLocaleDateString() : "—",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => statusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setViewing(row.original);
              setViewOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
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
          <h2 className="text-xl font-semibold">Notes de frais</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les dépenses des employés
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
                  {editing ? "Modifier la dépense" : "Nouvelle dépense"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Référence</Label>
                    <Input
                      name="reference"
                      value={formik.values.reference}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      name="date"
                      type="date"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.date && formik.errors.date && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Employé</Label>
                  <Select
                    value={formik.values.employee}
                    onValueChange={(v) => formik.setFieldValue("employee", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {employees.map((e) => (
                          <SelectItem key={e._id} value={e._id}>
                            {e.firstName} {e.lastName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={formik.values.type}
                      onValueChange={(v) => formik.setFieldValue("type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {EXPENSE_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <Select
                      value={formik.values.status}
                      onValueChange={(v) => formik.setFieldValue("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Montant</Label>
                    <Input
                      name="amount"
                      type="number"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.amount}</p>
                    )}
                  </div>
                  <div>
                    <Label>Devise</Label>
                    <Select
                      value={formik.values.currency}
                      onValueChange={(v) => formik.setFieldValue("currency", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
          data={expenses}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la dépense</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm py-2">
              <div>
                <span className="font-medium text-muted-foreground">Réf.:</span>{" "}
                {viewing.reference || "—"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Employé:</span>{" "}
                {empName(viewing.employee)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Type:</span>{" "}
                {EXPENSE_TYPES.find((t) => t.value === viewing.type)?.label ||
                  viewing.type ||
                  "—"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Montant:</span>{" "}
                {(viewing.amount || 0).toLocaleString()} {viewing.currency || "CDF"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date:</span>{" "}
                {viewing.date ? new Date(viewing.date).toLocaleDateString() : "—"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Statut:</span>{" "}
                {statusBadge(viewing.status)}
              </div>
              <div className="col-span-2">
                <span className="font-medium text-muted-foreground">Description:</span>{" "}
                {viewing.description || "—"}
              </div>
              {viewing.approvedBy && (
                <div className="col-span-2">
                  <span className="font-medium text-muted-foreground">Approuvé par:</span>{" "}
                  {viewing.approvedBy.fullName}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
