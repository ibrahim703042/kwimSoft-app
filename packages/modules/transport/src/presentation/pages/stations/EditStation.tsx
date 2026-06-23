import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button } from "@kwim/shared-ui";
import { stationApi } from "../../../application/transport.api";
import {
  STATION_COMPANY_ID,
  normalizeCoordinates,
  type StationData,
  type StationFormValues,
} from "../../../domain/station.types";
import ReusableDialogStepsEdit from "../../components/dialogs/ReusableDialogStepsEdit";
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
    locations: { type: "Point", coordinates: normalizeCoordinates(data.locations?.coordinates) },
  };
}

export default function EditStation({ station, openDialog, setOpenDialog }: EditStationProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: StationFormValues }) => stationApi.update(id, values),
    onSuccess: () => {
      Swal.fire("Succès!", "La station a été modifiée.", "success");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      setOpenDialog(false);
    },
    onError: () => Swal.fire("Erreur!", "Une erreur est survenue.", "error"),
  });

  const formik = useFormik<StationFormValues>({
    initialValues: toFormValues(station),
    enableReinitialize: true,
    onSubmit: async (values) => {
      await mutation.mutateAsync({ id: station._id, values });
    },
  });

  return (
    <ReusableDialogStepsEdit dialogTitle="Modifier la station" openDialog={openDialog} setOpenDialog={setOpenDialog}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <StationFormFields formik={formik} />
        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <ScaleLoader color="#ffffff" height={10} /> : "Modifier"}
          </Button>
        </div>
      </form>
    </ReusableDialogStepsEdit>
  );
}
