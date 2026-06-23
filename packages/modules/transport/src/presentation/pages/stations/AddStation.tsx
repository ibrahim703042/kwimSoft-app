import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button } from "@kwim/shared-ui";
import { stationApi } from "../../../application/transport.api";
import {
  DEFAULT_COORDINATES,
  STATION_COMPANY_ID,
  normalizeCoordinates,
  type StationFormValues,
} from "../../../domain/station.types";
import ReusableDialogSteps from "../../components/dialogs/ReusableDialogSteps";
import { StationFormFields } from "./StationFormFields";

const validationSchema = Yup.object({
  name: Yup.string().required("Le nom de la station est requis"),
  country: Yup.string().required("Le pays est requis"),
  state: Yup.string().required("L'état est requis"),
  address: Yup.string().required("L'adresse est requise"),
  postalCode: Yup.string().required("Le code postal est requis"),
  locations: Yup.object({
    coordinates: Yup.array().of(Yup.number()).length(2).required(),
  }).required(),
});

const initialValues: StationFormValues = {
  name: "",
  country: "",
  city: "",
  state: "",
  address: "",
  postalCode: "",
  company: STATION_COMPANY_ID,
  locations: { type: "Point", coordinates: normalizeCoordinates([...DEFAULT_COORDINATES]) },
};

export default function AddStation() {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: StationFormValues) => stationApi.create(values),
    onSuccess: () => {
      Swal.fire("Succès!", "La station a été enregistrée.", "success");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      setOpenDialog(false);
    },
    onError: () => Swal.fire("Erreur!", "Une erreur est survenue.", "error"),
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
    <ReusableDialogSteps dialogTitle="Ajouter une station" openDialog={openDialog} setOpenDialog={setOpenDialog}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <StationFormFields formik={formik} />
        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <ScaleLoader color="#ffffff" height={10} /> : "Enregistrer"}
          </Button>
        </div>
      </form>
    </ReusableDialogSteps>
  );
}
