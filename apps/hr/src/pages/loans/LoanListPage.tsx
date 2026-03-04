/**
 * LoanListPage - Loan management with full CRUD
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { loanApi, loanTypeApi, employeeApi } from "../../api/hr.api";

interface LoanFormValues {
  employee: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  purpose: string;
  remarks: string;
}

interface LoanItem {
  _id: string;
  loanNumber: string;
  employee?: { _id: string; firstName?: string; lastName?: string };
  loanType?: { _id: string; name: string };
  principalAmount: number;
  totalAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  monthlyInstallment?: number;
  status: string;
  applicationDate: string;
  purpose?: string;
}

const schema = Yup.object({
  employee: Yup.string().required("L'employé est requis"),
  loanType: Yup.string(),
  principalAmount: Yup.number().min(1, "Le montant doit être positif").required("Le montant est requis"),
  interestRate: Yup.number().min(0),
  tenureMonths: Yup.number().min(1, "Minimum 1 mois"),
  purpose: Yup.string(),
  remarks: Yup.string(),
});

const INITIAL: LoanFormValues = {
  employee: "",
  loanType: "",
  principalAmount: 0,
  interestRate: 0,
  tenureMonths: 12,
  purpose: "",
  remarks: "",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  fully_paid: "bg-purple-100 text-purple-800",
};

export default function LoanListPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LoanItem | null>(null);
  const qc = useQueryClient();

  const { data: loanData, isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => (await loanApi.getAll()).data,
  });
  const loans: LoanItem[] = loanData?.data || loanData?.content || [];

  const { data: loanTypeData } = useQuery({
    queryKey: ["loan-types"],
    queryFn: async () => (await loanTypeApi.getAll()).data,
  });
  const loanTypes = loanTypeData?.data || loanTypeData?.content || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || empData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: LoanFormValues) =>
      editing
        ? await loanApi.update(editing._id, values as unknown as Record<string, unknown>)
        : await loanApi.create(values as unknown as Record<string, unknown>),
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `Le prêt a été ${editing ? "modifié" : "créé"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["loans"] });
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
    mutationFn: async (id: string) => await loanApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Prêt supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<LoanFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        employee: editing.employee?._id || "",
        loanType: editing.loanType?._id || "",
        principalAmount: editing.principalAmount || 0,
        interestRate: 0,
        tenureMonths: 12,
        purpose: editing.purpose || "",
        remarks: "",
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
    { accessorKey: "loanNumber", header: "N° Prêt" },
    {
      accessorKey: "employee",
      header: "Employé",
      cell: ({ row }: any) => {
        const e = row.original.employee;
        return e ? `${e.firstName || ""} ${e.lastName || ""}`.trim() : "—";
      },
    },
    {
      accessorKey: "loanType",
      header: "Type",
      cell: ({ row }: any) => row.original.loanType?.name || "—",
    },
    {
      accessorKey: "principalAmount",
      header: "Montant",
      cell: ({ row }: any) =>
        row.original.principalAmount?.toLocaleString() || "0",
    },
    {
      accessorKey: "remainingAmount",
      header: "Reste à payer",
      cell: ({ row }: any) =>
        row.original.remainingAmount?.toLocaleString() || "0",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${statusColors[row.original.status] || "bg-gray-100"
            }`}
        >
          {row.original.status}
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
            onClick={() => navigate(`/hr/loans/${row.original._id}`)}
            title="Voir les détails"
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
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original._id)}
            title="Supprimer"
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
          <h2 className="text-xl font-semibold">Liste des Prêts</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les demandes de prêts des employés
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-4 w-4 mr-2" /> Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier le prêt" : "Nouvelle demande de prêt"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Employé</Label>
                  <Select
                    value={formik.values.employee}
                    onValueChange={(v) => formik.setFieldValue("employee", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
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
                  {formik.touched.employee && formik.errors.employee && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.employee}</p>
                  )}
                </div>
                <div>
                  <Label>Type de prêt</Label>
                  <Select
                    value={formik.values.loanType}
                    onValueChange={(v) => formik.setFieldValue("loanType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {loanTypes.map((lt: any) => (
                          <SelectItem key={lt._id} value={lt._id}>
                            {lt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Montant demandé</Label>
                    <Input
                      name="principalAmount"
                      type="number"
                      value={formik.values.principalAmount}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.principalAmount && formik.errors.principalAmount && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.principalAmount}</p>
                    )}
                  </div>
                  <div>
                    <Label>Durée (mois)</Label>
                    <Input
                      name="tenureMonths"
                      type="number"
                      value={formik.values.tenureMonths}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>Objet du prêt</Label>
                  <Textarea
                    name="purpose"
                    value={formik.values.purpose}
                    onChange={formik.handleChange}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Remarques</Label>
                  <Textarea
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    rows={2}
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
          data={loans}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
