
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { API_ROUTE } from "../../../config";
import ReusableDialogSteps from "../../component/utilitie/ReusableDialogSteps";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import Swal from "sweetalert2";

const createStop = async (values, idTrip) => {
    const response = await axios.post(
        `${API_ROUTE}/trip/stopover/add/${idTrip}`,
        values
    );
    return response.data;
};

export default function AddStop({ dataTrip }) {

    const [openDialog, setOpenDialog] = useState(false)
    const idTrip = dataTrip?._id
    console.log("JUSTIFY", idTrip);

    const mutation = useMutation({
        mutationFn: (values) => createStop(values, idTrip),
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "La station a été enregistrée avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            setOpenDialog(false);
        },
        onError: (error) => {
            const backendMessage = error.response?.data?.message;
            const errorMessage = Array.isArray(backendMessage)
                ? backendMessage.join(', ')
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


    const formik = useFormik({
        initialValues: {
            stationName: "",
            location: {
                type: "Point",
                coordinates: [],
            },
            scheduledArrivalDuration: "",
            scheduledDepartureDuration: "",
        },
        // validationSchema,
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync(values);
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    const { values } = formik
    console.log("INITIAL VALUES", values);


    return (
        <ReusableDialogSteps
            triggerText="Ajouter"
            dialogTitle="Ajouter une station"
            onSubmit={formik.handleSubmit}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
        >
            <div className="p-0 bg-white rounded-lg">

                <form onSubmit={formik.handleSubmit} className="grid grid-cols-12 gap-4">
                    {/* Nom de la station */}
                    <div className="col-span-6">
                        <Label className="block text-sm font-medium">Nom de la station</Label>
                        <Input
                            type="text"
                            name="stationName"
                            value={formik.values.stationName}
                            onChange={formik.handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {formik.errors.stationName && <p className="text-red-500 text-xs">{formik.errors.stationName}</p>}
                    </div>

                    {/* Coordonnées */}
                    <div className="col-span-3">
                        <Label className="block text-sm font-medium">Longitude</Label>
                        <Input
                            type="number"
                            name="location.coordinates[0]"
                            value={formik.values.location.coordinates[0]}
                            onChange={formik.handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="col-span-3">
                        <Label className="block text-sm font-medium">Latitude</Label>
                        <Input
                            type="number"
                            name="location.coordinates[1]"
                            value={formik.values.location.coordinates[1]}
                            onChange={formik.handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Durées */}
                    <div className="col-span-6">
                        <Label className="block text-sm font-medium">Arrivée prévue (min)</Label>
                        <Input
                            type="number"
                            name="scheduledArrivalDuration"
                            value={formik.values.scheduledArrivalDuration}
                            onChange={formik.handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="col-span-6">
                        <Label className="block text-sm font-medium">Départ prévu (min)</Label>
                        <Input
                            type="number"
                            name="scheduledDepartureDuration"
                            value={formik.values.scheduledDepartureDuration}
                            onChange={formik.handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <div className="col-span-12 flex justify-end">
                        <Button
                            type="submit"
                            className="px-4 py-2 text-white rounded disabled:opacity-50"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? "Ajout en cours..." : "Ajouter la station"}
                        </Button>
                    </div>
                </form>

                {/* Message d'erreur global */}
                {mutation.error && (
                    <p className="text-red-500 mt-2">
                        Erreur : {mutation.error.response?.data?.message?.join(', ') || mutation.error.message}
                    </p>
                )}
            </div>
        </ReusableDialogSteps>
    );
}
