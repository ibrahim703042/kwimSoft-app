/**
 * ContractPage - Contract management with full CRUD using TabbedForm
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@kwim/shared-ui";
import { CrudForm, CrudTable, TabbedForm } from "@kwim/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { contractApi, employeeApi } from "../../api/hr.api";
import { contractSchema, defaultValues, type ContractFormValues } from "./contract.schema";
import { useContractTabs } from "./useContractTabs";

interface ContractItem {
  _id: string;
  reference?: string;
  employee?: { _id: string; fullName?: string; firstName?: string; lastName?: string };
  type: string;
  startDate: string;
  endDate?: string;
  salary?: number;
  currency?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const CONTRACT_TYPES = [
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "interim", label: "Intérim" },
  { value: "stage", label: "Stage" },
  { value: "freelance", label: "Freelance" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "active", label: "Actif" },
  { value: "expired", label: "Expiré" },
  { value: "terminated", label: "Résilié" },
];

export default function ContractPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<ContractItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState<ContractItem | null>(null);
  const qc = useQueryClient();

  const { data: cData, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => (await contractApi.getAll()).data,
  });
  const contracts: ContractItem[] = cData?.data || [];

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || [];

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        reference: editing.reference || "",
        employee: editing.employee?._id || "",
        type: editing.type || "cdi",
        startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
        salary: editing.salary?.toString() || "",
        currency: editing.currency || "CDF",
        status: editing.status || "draft",
        notes: editing.notes || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: ContractFormValues) =>
      editing
        ? await contractApi.update(editing._id, values)
        : await contractApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", `Le contrat a été ${editing ? "modifié" : "créé"}.`, "success");
      qc.invalidateQueries({ queryKey: ["contracts"] });
      closeForm();
    },
    onError: (e: any) =>
      Swal.fire(
        "Erreur!",
        e.response?.data?.message || "Une erreur est survenue.",
        "error"
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await contractApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Contrat supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const empName = (e?: ContractItem["employee"]) =>
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
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      terminated: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || ""}`}>
        {STATUS_OPTIONS.find((o) => o.value === s)?.label || s}
      </span>
    );
  };

  const columns = [
    { accessorKey: "reference", header: "Référence" },
    {
      accessorKey: "employee",
      header: "Employé",
      cell: ({ row }: any) => empName(row.original.employee),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) =>
        CONTRACT_TYPES.find((t) => t.value === row.original.type)?.label || row.original.type,
    },
    {
      accessorKey: "startDate",
      header: "Début",
      cell: ({ row }: any) =>
        row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—",
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }: any) =>
        row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "—",
    },
    {
      accessorKey: "salary",
      header: "Salaire",
      cell: ({ row }: any) =>
        `${row.original.salary || 0} ${row.original.currency || "CDF"}`,
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
              setFormOpen(true);
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

  const tabs = useContractTabs({ form, employees });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Contrats</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les contrats des employés
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <CrudTable
          data={contracts}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
          else setFormOpen(true);
        }}
        title={editing ? "Modifier le contrat" : "Nouveau contrat"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <div className="border-b my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du contrat</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm py-2">
              <div>
                <span className="font-medium text-muted-foreground">Référence:</span>{" "}
                {viewing.reference}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Employé:</span>{" "}
                {empName(viewing.employee)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Type:</span>{" "}
                {CONTRACT_TYPES.find((t) => t.value === viewing.type)?.label || viewing.type}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Statut:</span>{" "}
                {statusBadge(viewing.status)}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Début:</span>{" "}
                {viewing.startDate ? new Date(viewing.startDate).toLocaleDateString() : "—"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Fin:</span>{" "}
                {viewing.endDate ? new Date(viewing.endDate).toLocaleDateString() : "—"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Salaire:</span>{" "}
                {viewing.salary || 0} {viewing.currency || "CDF"}
              </div>
              <div className="col-span-2">
                <span className="font-medium text-muted-foreground">Notes:</span>{" "}
                {viewing.notes || "—"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
