import { useEffect, useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTE, API_ROUTE_PASSWORD, API_ROUTE_UPLOAD } from "../../../config";
import ReusableDialogSteps from "../../component/utilitie/ReusableDialogSteps";
import Steps from "../../component/utilitie/Steps";
import { Button } from "../../components/ui/button";
import { DialogFooter } from "../../components/ui/dialog";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";

// Fonction pour créer la compagnie
const createCompany = async (values) => {
    console.log("DATA SENDER >>>>>__________________", values);
    const response = await axios.post(`${API_ROUTE_PASSWORD}/companies`, values);
    return response.data;
};

export default function AddCompany() {
    const [openDialog, setOpenDialog] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({ latitude: "", longitude: "" });
    const queryClient = useQueryClient();

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const uploadImages = async (files, setFieldValue) => {
        try {
            const formData = new FormData();
            // Ajout des fichiers dans FormData
            files.forEach((file) => formData.append("files", file)); // Utiliser "files" pour plusieurs fichiers
            // Envoi avec fetch
            const response = await fetch(`${API_ROUTE_UPLOAD}/upload-files/images`, {
                method: "POST",
                body: formData, // Envoi du formData
            });
            const data = await response.json();
            if (data?.images?.length > 0) {
                const imageUrl = `${API_ROUTE_UPLOAD}/images/${data.images[0].url.split('/').pop()}`;
                console.log("URL GÉNÉRÉE :::::", imageUrl);
                setFieldValue("logo", imageUrl);
            }
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };

    const uploadPDF = async (files, setFieldValue, formikValues) => {
        try {
            const uploadedUrls = [...(formikValues.insurance.documents || [])];

            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                console.log("Envoi du fichier :", file.name);

                const response = await fetch(`${API_ROUTE_UPLOAD}/upload-files/pdf`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Erreur API: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("URL GÉNÉRÉE :", data);
                const fullUrl = `${API_ROUTE_UPLOAD}/${data?.pdfUrl}`; // Concatène l'URL de base avec le chemin retourné
                uploadedUrls.push(fullUrl);
            }

            setFieldValue("insurance.documents", uploadedUrls); // Mets à jour formik avec toutes les URLs
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };



    // Mutation React Query
    const mutation = useMutation({
        mutationFn: createCompany,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Enregistrement effectué avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries(["compagnie"]);
            setOpenDialog(false);
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Une erreur est survenue. Veuillez réessayer.",
                icon: "error",
                confirmButtonText: "OK",
            });
            setOpenDialog(false);
        },
    });


    const validationSchemas = [
        Yup.object({
            name: Yup.string()
                .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Le nom ne doit contenir que des lettres")
                .required("Le nom est requis"),
            siret: Yup.string()
                .required("Le NIF de la compagnie est obligatoire")
                .matches(/^\d+$/, "Le NIF doit contenir uniquement des chiffres")
                .length(14, "Le NIF doit contenir exactement 14 caractères"),
            vatNumber: Yup.string().required("Le numéro de TVA est requis"),
            rcsNumber: Yup.string().required("Le numéro RCS est requis"),
            transportLicenseNumber: Yup.string().required("Le numéro de licence de transport est requis"),
            transportScope: Yup.array()
                .min(1, "Veuillez sélectionner au moins une zone de transport")
                .required("Veuillez sélectionner au moins une zone de transport"),
            description: Yup.string()
                .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "La description ne doit contenir que des lettres")
                .notRequired(),

        }),
        Yup.object({
            address: Yup.object().shape({
                complement: Yup.string().required("Le complément d'adresse est requis"),
                street: Yup.string().required("L'adresse est obligatoire"),
                city: Yup.string().required("La ville est obligatoire"),
            }),
            country: Yup.string().required("Le pays est obligatoire"),
            location: Yup.object().shape({
                latitude: Yup.string()
                    .required("La latitude est obligatoire")
                    .matches(/^-?\d+(\.\d+)?$/, "Format de latitude invalide"),
                longitude: Yup.string()
                    .required("La longitude est obligatoire")
                    .matches(/^-?\d+(\.\d+)?$/, "Format de longitude invalide"),
            }),
        }),

        Yup.object({
            email: Yup.string()
                .required("L'adresse e-mail est obligatoire @gmail.com")
                .email("Veuillez entrer une adresse e-mail valide"),
            phone: Yup.string()
                .required("Le numéro de téléphone est obligatoire")
                .matches(/^\+\d{6,15}$/, "Le numéro de téléphone doit être au format international (+257)"),
            website: Yup.string()
                .trim()
                .test("is-valid-url", "L'URL du site web n'est pas valide. Exemple : https://exemple.fr", (value) => {
                    if (!value) return true; // Autoriser une valeur vide (nullable)

                    // Vérifie si l'URL commence par "http://" ou "https://"
                    const hasProtocol = /^(https?:\/\/)/.test(value);

                    // Vérifie si l'URL commence par "www."
                    const hasWWW = /^www\./.test(value);

                    // Vérifie si c'est un domaine valide (ex: exemple.com)
                    const isValidDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

                    // Si l'URL est valide sous au moins une des trois formes, on accepte
                    return hasProtocol || hasWWW || isValidDomain;
                })
                .nullable(),

        }),

        Yup.object({
            insurance: Yup.object({
                provider: Yup.string().required("Le fournisseur est requis"),
                policyNumber: Yup.string().required("Le numéro de police est requis"),
                coverage: Yup.string().required("La couverture est requise"),
                expiryDate: Yup.date().required("Date d'expiration requise"),
            }),
        }),
    ];

    const formik = useFormik({
        initialValues: {
            name: "",
            country: "",
            siret: "",
            vatNumber: "",
            rcsNumber: "",
            description: "",
            logo: "",
            email: "",
            phone: "",
            website: "",
            transportLicenseExpiry: "",
            transportLicenseNumber: "",
            address: { street: "", complement: "", city: "", postalCode: "" },
            location: { latitude: "", longitude: "" },
            transportScope: [],
            insurance: {
                provider: "",
                policyNumber: "",
                coverage: "",
                expiryDate: "",
                documents: [],
            },
        },
        validationSchema: validationSchemas[activeIndex],
        onSubmit: async (values) => {
            try {
                await mutation.mutateAsync(values);
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    const { values } = formik
    console.log("INITALLLLLLL::::", values);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSelectedLocation({ latitude, longitude });

                    // 🔹 Mise à jour correcte de Formik avec la position actuelle
                    formik.setFieldValue("location", { longitude, latitude });
                },
                (error) => {
                    console.error("Erreur de géolocalisation :", error.message);
                }
            );
        } else {
            console.error("La géolocalisation n'est pas supportée par ce navigateur.");
        }
    }, []);

    return (
        <div>
            <ReusableDialogSteps
                dialogTitle="Compagnie"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleModalOpen={() => setOpenDialog(true)}
            >
                <FormikProvider value={formik}>
                    <div className="w-full mx-auto flex items-center justify-center">
                        <div className="w-full max-w-sm">
                            <Steps steps={["Step 1", "Step 2", "Step 3", "Step 4"]} currentStep={activeIndex} />
                        </div>
                    </div>

                    <div className="form-group mb-5">
                        {activeIndex === 0 && <StepOne formik={formik} uploadImages={uploadImages} />}
                        {activeIndex === 1 && <StepTwo formik={formik} handleModalOpen={handleModalOpen} />}
                        {activeIndex === 2 && <StepThree formik={formik} />}
                        {activeIndex === 3 && <StepFour formik={formik} uploadPDF={uploadPDF} />}
                    </div>
                    <DialogFooter>
                        <div className="flex justify-between w-full mt-0">
                            {activeIndex > 0 && (
                                <Button
                                    type="button"
                                    onClick={() => setActiveIndex((prev) => prev - 1)}
                                    className="py-0 px-7 text-[0.7rem]"
                                >
                                    Précédent
                                </Button>
                            )}

                            {activeIndex < 3 ? (
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        const isValid = await formik.validateForm();
                                        if (Object.keys(isValid).length === 0) {
                                            setActiveIndex(prev => prev + 1);
                                        } else {
                                            formik.setTouched(isValid, true); // Marque les champs invalides
                                        }
                                    }}
                                    className="py-0 px-7 text-[0.7rem]"
                                >
                                    Suivant
                                </Button>

                            ) : (
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="py-0 px-7 text-[0.7rem] flex items-center justify-center"
                                    onClick={() => formik.submitForm()}
                                >
                                    {mutation.isPending ? (
                                        <div className="flex items-center space-x-2">
                                            <ScaleLoader color="#ffffff" height={10} />
                                            <span>Encours...</span>
                                        </div>
                                    ) : (
                                        "Enregistrer"
                                    )}
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </FormikProvider>
            </ReusableDialogSteps>
        </div>
    );
}
