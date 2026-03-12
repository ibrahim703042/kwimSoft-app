/**
 * CompanyPage - Company management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
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
import { companyApi } from "../../api/hr.api";

interface CompanyFormValues {
  name: string;
  code: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  currency: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface CompanyItem {
  _id: string;
  name: string;
  code?: string;
  legalName?: string;
  industry?: string;
  phone?: string;
  email?: string;
  status?: string;
  employeeCount?: number;
  address?: {
    city?: string;
    country?: string;
  };
  createdAt: string;
}

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Transportation",
  "Other",
];

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  code: Yup.string(),
  legalName: Yup.string(),
  registrationNumber: Yup.string(),
  taxId: Yup.string(),
  industry: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email("Email invalide"),
  website: Yup.string(),
  description: Yup.string(),
  currency: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  country: Yup.string(),
  postalCode: Yup.string(),
});

const INITIAL: CompanyFormValues = {
  name: "",
  code: "",
  legalName: "",
  registrationNumber: "",
  taxId: "",
  industry: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  currency: "USD",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export default function CompanyPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyItem | null>(null);
  const qc = useQueryClient();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => (await companyApi.getAll()).data,
  });
  const companies: CompanyItem[] = companyData?.data || companyData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: CompanyFormValues) => {
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
        ? await companyApi.update(editing._id, payload)
        : await companyApi.create(payload);
    },
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `L'entreprise a été ${editing ? "modifiée" : "créée"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["companies"] });
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
    mutationFn: async (id: string) => await companyApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Entreprise supprimée.", "success");
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<CompanyFormValues>({
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
        legalName: editing.legalName || "",
        registrationNumber: (editing as any).registrationNumber || "",
        taxId: (editing as any).taxId || "",
        industry: editing.industry || "",
        phone: editing.phone || "",
        email: editing.email || "",
        website: (editing as any).website || "",
        description: (editing as any).description || "",
        currency: (editing as any).currency || "USD",
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
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "industry", header: "Secteur" },
    {
      accessorKey: "address",
      header: "Localisation",
      cell: ({ row }: any) => {
        const addr = row.original.address;
        return addr ? `${addr.city || ""}, ${addr.country || ""}`.trim() : "—";
      },
    },
    { accessorKey: "phone", header: "Téléphone" },
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
          <h2 className="text-xl font-semibold">Entreprises</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les informations des entreprises
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
                  {editing ? "Modifier l'entreprise" : "Nouvelle entreprise"}
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
                    <Label>Raison sociale</Label>
                    <Input
                      name="legalName"
                      value={formik.values.legalName}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>Secteur d'activité</Label>
                    <Select
                      value={formik.values.industry}
                      onValueChange={(v) => formik.setFieldValue("industry", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>N° d'enregistrement</Label>
                    <Input
                      name="registrationNumber"
                      value={formik.values.registrationNumber}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <Label>N° fiscal</Label>
                    <Input
                      name="taxId"
                      value={formik.values.taxId}
                      onChange={formik.handleChange}
                    />
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
                    <Label>Site web</Label>
                    <Input
                      name="website"
                      value={formik.values.website}
                      onChange={formik.handleChange}
                    />
                  </div>
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
          data={companies}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
