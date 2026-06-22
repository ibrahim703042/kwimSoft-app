import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kwim/shared-ui";
import { stationApi } from "../../api/transport.api";
import {
  DEFAULT_COORDINATES,
  STATION_COMPANY_ID,
  normalizeCoordinates,
  type StationFormValues,
} from "./station.types";
import { StationFormFields } from "./StationFormFields";

const validationSchema = Yup.object({
  name: Yup.string().required("Le nom de la station est requis"),
  country: Yup.string().required("Le pays est requis"),
  state: Yup.string().required("L'état est requis"),
  address: Yup.string().required("L'adresse est requise"),
  postalCode: Yup.string().required("Le code postal est requis"),
  locations: Yup.object({
    coordinates: Yup.array()
      .of(Yup.number())
      .length(2, "Les coordonnées doivent être un tableau de 2 éléments")
      .required("Les coordonnées sont requises"),
  }).required("Les coordonnées sont requises"),
});

const initialValues: StationFormValues = {
  name: "",
  country: "",
  city: "",
  state: "",
  address: "",
  postalCode: "",
  company: STATION_COMPANY_ID,
  locations: {
    type: "Point",
    coordinates: normalizeCoordinates([...DEFAULT_COORDINATES]),
  },
};

export default function AddStation() {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: StationFormValues) => stationApi.create(values),
    onSuccess: () => {
      Swal.fire({
        title: "Succès!",
        text: "La station a été enregistrée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      setOpenDialog(false);
    },
    onError: (error: { response?: { data?: { message?: string | string[] } } }) => {
      const backendMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "Une erreur inconnue est survenue.";
      Swal.fire({ title: "Erreur!", text: errorMessage, icon: "error", confirmButtonText: "OK" });
    },
  });

  const formik = useFormik<StationFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await mutation.mutateAsync(values);
      resetForm();
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button type="button" size="icon" className="h-9 w-9" aria-label="Ajouter une station">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une station</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <StationFormFields formik={formik} />
          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <ScaleLoader color="#ffffff" height={10} />
                  En cours...
                </span>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
