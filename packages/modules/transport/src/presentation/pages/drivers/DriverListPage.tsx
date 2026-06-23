import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardPen, Eye } from "lucide-react";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import { CrudPage } from "@kwim/core";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kwim/shared-ui";
import { driverApi } from "../../../application/transport.api";
import { SEXES } from "../../../domain/transport.constants";
import ReusableDialogSteps from "../../components/dialogs/ReusableDialogSteps";
import ReusableDialogStepsEdit from "../../components/dialogs/ReusableDialogStepsEdit";
import ViewDriver from "./ViewDriver";

interface Driver {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber?: string;
  licenseDuration?: string;
  birthDate?: string;
  image?: string;
  sexe?: string;
  nationality?: string;
  begginingAt?: string;
  adresse?: string;
  company?: { _id?: string; name: string };
}

interface DriverFormValues {
  fullName: string;
  licenseNumber: string;
  licenseDuration: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  company: string;
  image: string;
  sexe: string;
  nationality: string;
  begginingAt: string;
  adresse: string;
}

const schema = Yup.object({
  fullName: Yup.string().required("Le nom est requis"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  phoneNumber: Yup.string().required("Le téléphone est requis"),
});

const INITIAL: DriverFormValues = {
  fullName: "",
  licenseNumber: "",
  licenseDuration: "",
  phoneNumber: "",
  email: "",
  birthDate: "",
  company: "",
  image: "",
  sexe: "",
  nationality: "",
  begginingAt: "",
  adresse: "",
};

function DriverFormFields({ formik }: { readonly formik: ReturnType<typeof useFormik<DriverFormValues>> }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Nom complet</Label>
        <Input name="fullName" value={formik.values.fullName} onChange={formik.handleChange} />
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" value={formik.values.email} onChange={formik.handleChange} />
      </div>
      <div>
        <Label>Téléphone</Label>
        <Input name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} />
      </div>
      <div>
        <Label>Permis</Label>
        <Input name="licenseNumber" value={formik.values.licenseNumber} onChange={formik.handleChange} />
      </div>
      <div>
        <Label>Sexe</Label>
        <Select value={formik.values.sexe} onValueChange={(v) => formik.setFieldValue("sexe", v)}>
          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SEXES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Adresse</Label>
        <Input name="adresse" value={formik.values.adresse} onChange={formik.handleChange} />
      </div>
    </div>
  );
}

function AddDriver() {
  const [openDialog, setOpenDialog] = useState(false);
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: DriverFormValues) => driverApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", "Conducteur créé.", "success");
      qc.invalidateQueries({ queryKey: ["drivers"] });
      setOpenDialog(false);
    },
    onError: () => Swal.fire("Erreur!", "Une erreur est survenue.", "error"),
  });
  const formik = useFormik<DriverFormValues>({
    initialValues: INITIAL,
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      await mutation.mutateAsync(values);
      resetForm();
    },
  });
  return (
    <ReusableDialogSteps dialogTitle="Ajouter un conducteur" openDialog={openDialog} setOpenDialog={setOpenDialog}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <DriverFormFields formik={formik} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <ScaleLoader color="#ffffff" height={10} /> : "Enregistrer"}
        </Button>
      </form>
    </ReusableDialogSteps>
  );
}

function EditDriverDialog({
  driver,
  open,
  onOpenChange,
}: Readonly<{ driver: Driver; open: boolean; onOpenChange: (v: boolean) => void }>) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: DriverFormValues) => driverApi.update(driver._id, values),
    onSuccess: () => {
      Swal.fire("Succès!", "Conducteur modifié.", "success");
      qc.invalidateQueries({ queryKey: ["drivers"] });
      onOpenChange(false);
    },
    onError: () => Swal.fire("Erreur!", "Une erreur est survenue.", "error"),
  });
  const formik = useFormik<DriverFormValues>({
    initialValues: { ...INITIAL, ...driver, company: driver.company?._id ?? "" },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => mutation.mutate(values),
  });
  return (
    <ReusableDialogStepsEdit dialogTitle="Modifier le conducteur" openDialog={open} setOpenDialog={onOpenChange}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <DriverFormFields formik={formik} />
        <Button type="submit" disabled={mutation.isPending}>Modifier</Button>
      </form>
    </ReusableDialogStepsEdit>
  );
}

export default function DriverListPage() {
  const [editData, setEditData] = useState<Driver | null>(null);
  const [viewData, setViewData] = useState<Driver | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const columns: ColumnDef<Driver>[] = [
    { accessorKey: "fullName", header: "Nom" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Téléphone" },
    {
      accessorKey: "company.name",
      header: "Compagnie",
      cell: ({ row }) => row.original.company?.name || "N/A",
    },
  ];

  const customActions = (row: Driver) => (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" className="p-2" onClick={() => { setEditData(row); setOpenEdit(true); }}>
              <ClipboardPen size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" className="p-2" onClick={() => setViewData(row)}>
              <Eye size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Voir le détail</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <>
      <CrudPage
        config={{
          title: "Conducteurs",
          queryKey: ["drivers"],
          queryFn: driverApi.list,
          columns,
          deleteFn: async (id) => { await driverApi.delete(id); },
          permissions: {
            read: "driver.read",
            create: "driver.create",
            update: "driver.update",
            delete: "driver.delete",
          },
          customActions,
        }}
        addButton={<AddDriver />}
      />
      {openEdit && editData && (
        <EditDriverDialog driver={editData} open={openEdit} onOpenChange={setOpenEdit} />
      )}
      {viewData && <ViewDriver driver={viewData} onClose={() => setViewData(null)} />}
    </>
  );
}
