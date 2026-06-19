import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import ReusableDialogStepsEdit from "@/components/utilitie/ReusableDialogStepsEdit";
import { Button } from "@/components/ui/button";
import { stationApi } from "@/modules/transport/api/transport.api";
import {
  DEFAULT_COORDINATES,
  STATION_COMPANY_ID,
  type StationData,
  type StationFormValues,
} from "./station.types";
import { StationFormFields } from "./StationFormFields";
import { useStationMapForm } from "./useStationMapForm";

interface EditStationProps {
  readonly BusData: StationData;
  readonly openDialog: boolean;
  readonly setOpenDialog: (open: boolean) => void;
}

function toFormValues(data: StationData): StationFormValues {
  return {
    name: data.name ?? "",
    country: data.country ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
    address: data.address ?? "",
    postalCode: data.postalCode ?? "",
    company: STATION_COMPANY_ID,
    locations: {
      type: "Point",
      coordinates: data.locations?.coordinates ?? [...DEFAULT_COORDINATES],
    },
  };
}

export default function EditStation({
  BusData,
  openDialog,
  setOpenDialog,
}: Readonly<EditStationProps>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: StationFormValues }) =>
      stationApi.update(id, values),
    onSuccess: () => {
      Swal.fire({
        title: "Succès!",
        text: "La station a été modifiée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { popup: "swal-custom" },
      });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      setOpenDialog(false);
    },
    onError: (error: { response?: { data?: { message?: string | string[] } } }) => {
      const backendMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || "Une erreur inconnue est survenue.";

      Swal.fire({
        title: "Erreur!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
      setOpenDialog(false);
    },
  });

  const formik = useFormik<StationFormValues>({
    initialValues: toFormValues(BusData),
    enableReinitialize: true,
    onSubmit: async (values) => {
      await mutation.mutateAsync({ id: BusData._id, values });
    },
  });

  const { selectedLocation, handleMapClick } = useStationMapForm(formik);

  return (
    <ReusableDialogStepsEdit
      dialogTitle="Modifier la station"
      onSubmit={formik.handleSubmit}
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <StationFormFields
          formik={formik}
          selectedLocation={selectedLocation}
          onMapClick={handleMapClick}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <div className="flex items-center space-x-2">
                <ScaleLoader color="#ffffff" height={10} />
                <span>En cours...</span>
              </div>
            ) : (
              "Modifier"
            )}
          </Button>
        </div>
      </form>
    </ReusableDialogStepsEdit>
  );
}
