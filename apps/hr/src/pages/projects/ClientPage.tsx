/**
 * ClientPage - Client management with full CRUD
 */
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
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
} from "@kwim/shared-ui";
import { CrudTable } from "@kwim/core";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { clientApi } from "../../api/hr.api";

interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  industry: string;
  website: string;
  notes: string;
}

interface ClientItem {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  industry?: string;
  website?: string;
  status?: string;
  createdAt: string;
}

const schema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  email: Yup.string().email("Email invalide"),
  phone: Yup.string(),
  address: Yup.string(),
  contactPerson: Yup.string(),
  industry: Yup.string(),
  website: Yup.string(),
  notes: Yup.string(),
});

const INITIAL: ClientFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  contactPerson: "",
  industry: "",
  website: "",
  notes: "",
};

export default function ClientPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClientItem | null>(null);
  const qc = useQueryClient();

  const { data: clientData, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => (await clientApi.getAll()).data,
  });
  const clients: ClientItem[] = clientData?.data || clientData?.content || [];

  const mutation = useMutation({
    mutationFn: async (values: ClientFormValues) =>
      editing
        ? await clientApi.update(editing._id, values)
        : await clientApi.create(values),
    onSuccess: () => {
      Swal.fire(
        "Succès!",
        `Le client a été ${editing ? "modifié" : "créé"} avec succès.`,
        "success"
      );
      qc.invalidateQueries({ queryKey: ["clients"] });
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
    mutationFn: async (id: string) => await clientApi.delete(id),
    onSuccess: () => {
      Swal.fire("Supprimé!", "Client supprimé.", "success");
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => Swal.fire("Erreur!", "Impossible de supprimer.", "error"),
  });

  const formik = useFormik<ClientFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: (v) => mutation.mutateAsync(v),
  });

  useEffect(() => {
    if (editing) {
      formik.setValues({
        name: editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
        address: editing.address || "",
        contactPerson: editing.contactPerson || "",
        industry: editing.industry || "",
        website: editing.website || "",
        notes: "",
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
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "contactPerson", header: "Contact" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Téléphone" },
    { accessorKey: "industry", header: "Secteur" },
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
          <h2 className="text-xl font-semibold">Clients</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les clients de l'entreprise
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-4 w-4 mr-2" /> Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Modifier le client" : "Nouveau client"}
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
                    <Label>Personne de contact</Label>
                    <Input
                      name="contactPerson"
                      value={formik.values.contactPerson}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label>Téléphone</Label>
                    <Input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Secteur d'activité</Label>
                    <Input
                      name="industry"
                      value={formik.values.industry}
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
                <div>
                  <Label>Adresse</Label>
                  <Input
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    name="notes"
                    value={formik.values.notes}
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
          data={clients}
          columns={columns}
          isLoading={isLoading}
          enablePagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
