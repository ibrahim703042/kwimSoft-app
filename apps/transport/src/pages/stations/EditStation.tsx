import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@kwim/shared-ui";
import { stationApi } from "../../api/transport.api";
import {
  STATION_COMPANY_ID,
  normalizeCoordinates,
  type StationData,
  type StationFormValues,
} from "./station.types";
import { StationFormFields } from "./StationFormFields";

interface EditStationProps {
  readonly station: StationData;
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
      coordinates: normalizeCoordinates(data.locations?.coordinates),
    },
  };
}

export default function EditStation({ station, openDialog, setOpenDialog }: EditStationProps) {
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
    initialValues: toFormValues(station),
    enableReinitialize: true,
    onSubmit: async (values) => {
      await mutation.mutateAsync({ id: station._id, values });
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la station</DialogTitle>
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
                "Modifier"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
