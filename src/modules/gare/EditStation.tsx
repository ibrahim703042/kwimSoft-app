import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import MapComponent from "@/components/others/cartoTrip/MapComponent";
import axios from "axios";
import { API_ROUTE } from "../../../config.tsx";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ReusableDialogStepsEdit from "@/components/utilitie/ReusableDialogStepsEdit";
import ScaleLoader from "react-spinners/ScaleLoader";

// Clé d'API Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A";

interface StationFormValues {
    name: string;
    state: string;
    country: string;
    city: string;
    address: string;
    postalCode?: string;
    company: string;
    locations: {
        type: string;
        coordinates: number[];
    };
}

interface StationData {
    _id: string;
    name?: string;
    state?: string;
    country?: string;
    city?: string;
    address?: string;
    postalCode?: string;
    locations?: {
        type?: string;
        coordinates?: number[];
    };
}

interface EditStationProps {
    BusData: StationData;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

const createGare = async ({ id, values }: { id: string; values: StationFormValues }) => {
    const response = await axios.patch(
        `${API_ROUTE}/stations/${id}`,
        values
    );
    return response.data;
};

export default function EditStation({ BusData, openDialog, setOpenDialog }: EditStationProps) {
    const mutation = useMutation({
        mutationFn: createGare,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le station a été modifier avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            setOpenDialog(false);
        },
        onError: (error: any) => {
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

    // Initialisation du formulaire avec Formik
    const formik = useFormik({
        initialValues: {
            name: BusData?.name || "",
            country: BusData?.country || "",
            city: BusData?.city || "",
            state: BusData?.state || "",
            address: BusData?.address || "",
            postalCode: BusData?.postalCode || "",
            company: "67bc9002f682d26a7f7a9200",
            locations: {
                type: "Point",
                coordinates: BusData?.locations?.coordinates || [29.3640, -3.3792],
            },
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync({ id: BusData?._id, values });
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    // État pour stocker la position sélectionnée sur la carte
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: formik.values?.locations?.coordinates?.[1] ?? -3.3792,
        longitude: formik.values?.locations?.coordinates?.[0] ?? 29.3640,
    });

    // 🔹 Récupérer la position actuelle du client au chargement
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setSelectedLocation({ latitude, longitude });

                    // 🔹 Mettre à jour Formik avec la position actuelle
                    formik.setFieldValue("locations.coordinates", [longitude, latitude]);
                },
                (error) => {
                    console.error("Erreur de géolocalisation :", error);
                }
            );
        } else {
            console.error("La géolocalisation n'est pas supportée par ce navigateur.");
        }
    }, []);

    // 🔹 Mise à jour de la position sélectionnée quand l'utilisateur clique sur la carte
    const handleMapClick = async (event: any) => {
        const { lng, lat } = event.lngLat;
        setSelectedLocation({ latitude: lat, longitude: lng });

        // Mettre à jour Formik avec les nouvelles coordonnées
        formik.setFieldValue("locations.coordinates", [lng, lat]);

        try {
            const response = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
                {
                    params: {
                        access_token: mapboxgl.accessToken,
                        types: "place,region,country",
                        language: "fr",
                    },
                }
            );
            console.log("Réponse Mapbox :", response.data.features);

            if (response.data.features.length > 0) {
                let country = "";
                let region = "";
                let adresssse = "";

                response.data.features.forEach((feature: any) => {
                    if (feature.place_type.includes("country")) {
                        country = feature.text;
                    }
                    if (feature.place_type.includes("place")) {
                        adresssse = feature.place_name;
                    }
                    if (feature.context) {
                        feature.context.forEach((ctx: any) => {
                            if (ctx.id.includes("region")) {
                                region = ctx.text;
                            }
                        });
                    }
                });

                formik.setFieldValue("country", country);
                formik.setFieldValue("city", region);
                formik.setFieldValue("address", adresssse);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données de localisation :", error);
        }
    };

    const { values } = formik
    console.log("formikformikformikformik", values);


    return (
        <div>
            <ReusableDialogStepsEdit
                dialogTitle="Ajouter un Station"
                onSubmit={formik.handleSubmit}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            >
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <MapComponent
                                latitude={selectedLocation.latitude}
                                longitude={selectedLocation.longitude}
                                onClick={handleMapClick}
                            />
                        </div>

                        <div className="col-span-6">
                            <Label>Pays</Label>
                            <Input
                                type="text"
                                name="departureStation.country"
                                placeholder="Pays"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="col-span-6">
                            <Label>Région</Label>
                            <Input
                                type="text"
                                name="city"
                                placeholder="Ville"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="col-span-6">
                            <Label>Longitude</Label>
                            <Input
                                type="number"
                                placeholder="Longitude"
                                value={formik.values.locations.coordinates[0]}
                                readOnly
                                className="cursor-pointer"
                                disabled
                            />
                        </div>

                        <div className="col-span-6">
                            <Label>Latitude</Label>
                            <Input
                                type="number"
                                placeholder="Latitude"
                                value={formik.values.locations.coordinates[1]}
                                readOnly
                                className="cursor-pointer"
                                disabled
                            />
                        </div>

                        <div className="col-span-4">
                            <Label>Gare</Label>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nom"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div className="col-span-4">
                            <Label>Station</Label>
                            <Input
                                type="text"
                                name="state"
                                placeholder="Station"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="col-span-4">
                            <Label>Code Trajet</Label>
                            <Input
                                type="text"
                                name="postalCode"
                                placeholder="Code trajet"
                                value={formik.values.postalCode}
                                onChange={formik.handleChange}
                            />
                        </div>


                        <div className="col-span-12 flex justify-end">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <ScaleLoader color="#ffffff" height={10} />
                                        <span>Encours...</span>
                                    </div>
                                ) : (
                                    "Modifier"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </ReusableDialogStepsEdit>
        </div>
    );
}
