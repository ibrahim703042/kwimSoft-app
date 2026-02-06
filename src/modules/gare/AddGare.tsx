import { useEffect, useState } from "react";
import { useFormik } from "formik";
import ReusableDialogSteps from "@/components/utilitie/ReusableDialogSteps";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import MapComponent from "@/components/others/cartoTrip/MapComponent";
import axios from "axios";
import { API_ROUTE } from "../../../config.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
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

const createGare = async (values: StationFormValues) => {
    console.log("DATA SENDER >>>>>", values);
    const response = await axios.post(
        `${API_ROUTE}/stations`,
        values
    );
    return response.data;
};

export default function AddGare() {
    const [openDialog, setOpenDialog] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createGare,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le bus a été enregistrée avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries({ queryKey: ["statations"] });
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

    const validationSchema = Yup.object({
        name: Yup.string().required("Le nom de la station est requis"),
        country: Yup.string().required("Le pays est requis"),
        // city: Yup.string().required("La ville est requise"),
        state: Yup.string().required("L'état est requis"),
        address: Yup.string().required("L'adresse est requise"),
        postalCode: Yup.string().required("Le code postal est requis"),
        locations: Yup.object({
            coordinates: Yup.array().of(Yup.number()).length(2, "Les coordonnées doivent être un tableau de 2 éléments").required("Les coordonnées sont requises"),
        }).required("Les coordonnées sont requises"),
    });


    // Initialisation du formulaire avec Formik
    const formik = useFormik({
        initialValues: {
            name: "",
            country: "",
            city: "",
            state: "",
            address: "",
            postalCode: "",
            company: "67bc9002f682d26a7f7a9200",
            locations: {
                type: "Point",
                coordinates: [29.3640, -3.3792], // Coordonnées par défaut
            },
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync(values);
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
            <ReusableDialogSteps
                dialogTitle="Ajouter un Station"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            >
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <MapComponent
                                latitude={selectedLocation.latitude}
                                longitude={selectedLocation.longitude}
                                height="200px"
                                onClick={handleMapClick}
                            />
                        </div>

                        <div className="col-span-6">
                            <Label>Pays <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="text"
                                name="departureStation.country"
                                placeholder="Pays"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                readOnly
                                disabled
                            />
                            {formik.touched.country && formik.errors.country && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.country}</p>
                            )}
                        </div>

                        <div className="col-span-6">
                            <Label>Région <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="text"
                                name="city"
                                placeholder="Ville"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                readOnly
                                disabled
                            />
                            {/* {formik.touched.city && formik.errors.city && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.city}</p>
                            )} */}
                        </div>

                        <div className="col-span-6">
                            <Label>Longitude <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="number"
                                placeholder="Longitude"
                                value={formik.values.locations.coordinates[0]}
                                readOnly
                                className="cursor-pointer"
                                disabled
                            />
                            {formik.touched.locations?.coordinates && formik.errors.locations?.coordinates && formik.errors.locations.coordinates[0] && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.locations.coordinates[0]}</p>
                            )}
                        </div>

                        <div className="col-span-6">
                            <Label>Latitude <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="number"
                                placeholder="Latitude"
                                value={formik.values.locations.coordinates[1]}
                                readOnly
                                className="cursor-pointer"
                                disabled
                            />
                            {formik.touched.locations?.coordinates && formik.errors.locations?.coordinates && formik.errors.locations.coordinates[1] && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.locations.coordinates[1]}</p>
                            )}
                        </div>

                        <div className="col-span-4">
                            <Label>Gare <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nom"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="col-span-4">
                            <Label>Station <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="text"
                                name="state"
                                placeholder="Station"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.state && formik.errors.state && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.state}</p>
                            )}
                        </div>
                        <div className="col-span-4">
                            <Label>Code Trajet <span className="text-red-500 text-[0.7rem]">*</span></Label>
                            <Input
                                type="text"
                                name="postalCode"
                                placeholder="Code trajet"
                                value={formik.values.postalCode}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.postalCode && formik.errors.postalCode && (
                                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.postalCode}</p>
                            )}
                        </div>


                        <div className="col-span-12 flex justify-end">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <ScaleLoader color="#ffffff" height={10} />
                                        <span>Encours...</span>
                                    </div>
                                ) : (
                                    "Enregistrer"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </ReusableDialogSteps>

            {/* Map dialog commented out - DialogMap component needs to be created */}
            {/* {openMapDialog && (
                <DialogMap
                    open={openMapDialog}
                    setOpen={setOpenMapDialog}
                    formik={formik}
                />
            )} */}
        </div>
    );
}
