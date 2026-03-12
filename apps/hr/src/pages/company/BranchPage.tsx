/**
 * BranchPage - Branch management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
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
import { branchApi, companyApi } from "../../api/hr.api";

interface BranchFormValues {
  name: string;
  code: string;
  company: string;
  type: string;
  phone: string;
  email: string;
  managerName: string;
  isHeadquarters: boolean;
  description: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface BranchItem {
  _id: string;
  name: string;
  code?: string;
  company?: { _id: string; name: string };
  type?: string;
  status?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  isHeadquarters?: boolean;
  employeeCount?: number;
  address?: {
    city?: string;
    country?: string;
  };
  createdAt: string;
}

const branchTypes = [
  { value: "headquarters", label: "Siège social" },
  { value: "regional_office", label: "Bureau régional" },
  { value: "operational", label: "Opérationnel" },
];

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  code: Yup.string(),
  company: Yup.string(),
  type: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email("Email invalide"),
  managerName: Yup.string(),
  isHeadquarters: Yup.boolean(),
  description: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  country: Yup.string(),
  postalCode: Yup.string(),
});

const INITIAL: BranchFormValues = {
  name: "",
  code: "",
  company: "",
  type: "operational",
  phone: "",
  email: "",
  managerName: "",
  isHeadquarters: false,
  description: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export default function BranchPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BranchItem | null>(null);
  const qc = useQueryClient();

  const { data: branchData, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => (await branchApi.getAll()).data,
  });
  const branches: BranchItem[] = branchData?.data || branchData?.content || [];

  const { data: companyData } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => (await companyApi.getAll()).data,
  });
  const companies = companyData?.data || companyData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: BranchFormValues) => {
      const payload = {
        ...values,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
          postalCode: values.postalCode,
        },
      };
      return editing
        ? await branchApi.update(editing._id, payload)
        : await branchApi.create(payload);
    },
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `La succursale a été ${editing ? "modifiée" : "créée"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["branches"] });
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
    mutationFn: async (id: string) => await branchApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Succursale supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["branches"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<BranchFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      const addr = (editing as any).address || {};
      formik.setValues({
        name: editing.name || "",
        code: editing.code || "",
        company: editing.company?._id || "",
        type: editing.type || "operational",
        phone: editing.phone || "",
        email: editing.email || "",
        managerName: editing.managerName || "",
        isHeadquarters: editing.isHeadquarters ?? false,
        description: (editing as any).description || "",
        street: addr.street || "",
        city: addr.city || "",
        state: addr.state || "",
        country: addr.country || "",
        postalCode: addr.postalCode || "",
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
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
          {row.original.isHeadquarters && (
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
              Siège
            </span>
          )}
        </div>
      ),
    },
    { accessorKey: "code", header: "Code" },
    {
      accessorKey: "company",
      header: "Entreprise",
      cell: ({ row }: any) => row.original.company?.name || "—",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) =>
        branchTypes.find((t) => t.value === row.original.type)?.label || row.original.type,
    },
    {
      accessorKey: "address",
      header: "Localisation",
      cell: ({ row }: any) => {
        const addr = row.original.address;
        return addr ? `${addr.city || ""}, ${addr.country || ""}`.trim() : "—";
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.status || "active"}
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
          <h2 className="text-xl font-semibold">Succursales</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les succursales et bureaux
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
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier la succursale" : "Nouvelle succursale"}
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
                    <Label>Entreprise</Label>
                    <Select
                      value={formik.values.company}
                      onValueChange={(v) => formik.setFieldValue("company", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((c: any) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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
                          {branchTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Responsable</Label>
                    <Input
                      name="managerName"
                      value={formik.values.managerName}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isHeadquarters"
                    checked={formik.values.isHeadquarters}
                    onCheckedChange={(v) => formik.setFieldValue("isHeadquarters", v)}
                  />
                  <Label htmlFor="isHeadquarters">Siège social</Label>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Adresse</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Rue</Label>
                      <Input
                        name="street"
                        value={formik.values.street}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div>
                      <Label>Ville</Label>
                      <Input
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label>État/Province</Label>
                      <Input
                        name="state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div>
                      <Label>Pays</Label>
                      <Input
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div>
                      <Label>Code postal</Label>
                      <Input
                        name="postalCode"
                        value={formik.values.postalCode}
                        onChange={formik.handleChange}
                      />
                    </div>
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
          data={branches}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
