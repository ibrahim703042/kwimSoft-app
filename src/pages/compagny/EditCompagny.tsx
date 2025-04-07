import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTE, API_ROUTE_UPLOAD } from "../../../config";
import Steps from "../../component/utilitie/Steps";
import { Button } from "../../components/ui/button";
import { DialogFooter } from "../../components/ui/dialog";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import axios from "axios";
import ReusableDialogStepsEdit from "../../component/utilitie/ReusableDialogStepsEdit";
import ScaleLoader from "react-spinners/ScaleLoader";

// Fonction pour mettre à jour la compagnie
const updateCompany = async ({ id, values }) => {
    const response = await axios.put(
        `${API_ROUTE}/companies/${id}`,
        values
    );
    return response.data;
};

export default function EditCompany({ compagnyData, openDialog, setOpenDialog }) {
    const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
    const [activeIndex, setActiveIndex] = useState(0);
    const queryClient = useQueryClient();
    console.log("compagnyData", compagnyData);


    const uploadImages = async (files, setFieldValue) => {
        try {
            const formData = new FormData();

            // Ajout des fichiers dans FormData
            files.forEach((file) => formData.append("files", file));

            // Envoi avec fetch
            const response = await fetch(`${API_ROUTE_UPLOAD}/upload-files/images`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            console.log("Datat Url Image", data);

            if (data?.images?.length > 0) {
                const imageUrl = `${API_ROUTE_UPLOAD}/images/${data.images[0].url.split('/').pop()}`; 
                console.log("URL GÉNÉRÉE :::::", imageUrl);
                setFieldValue("logo", imageUrl); // Stocker l'URL complète en string
            }            
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };


    // Mutation React Query
    const mutation = useMutation({
        mutationFn: updateCompany,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Modification effectuée avec succès.",
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

    const formik = useFormik({
        initialValues: {
            name: compagnyData?.name || "",
            country: compagnyData?.country?._id || "",
            siret: compagnyData?.siret || "",
            vatNumber: compagnyData?.vatNumber || "",
            rcsNumber: compagnyData?.rcsNumber || "",
            description: compagnyData?.description || "",
            logo: compagnyData?.logo || "",
            address: {
                street: compagnyData?.address?.street || "",
                complement: compagnyData?.address?.complement || "",
                city: compagnyData?.address?.city || "",
                postalCode: compagnyData?.address?.postalCode || ""
            },
            location: {
                latitude: compagnyData?.location?.latitude || "",
                longitude: compagnyData?.location?.longitude || ""
            },
            email: compagnyData?.email || "",
            phone: compagnyData?.phone || "",
            website: compagnyData?.website || "",
            transportLicenseExpiry: compagnyData?.transportLicenseExpiry || "",
            transportLicenseNumber: compagnyData?.transportLicenseNumber || "",
            totalBus: compagnyData?.totalBus || "",
            transportScope: compagnyData?.transportScope || [],
            insurance: {
                provider: compagnyData?.insurance?.provider || "",
                policyNumber: compagnyData?.insurance?.policyNumber || "",
                coverage: compagnyData?.insurance?.coverage || "",
                expiryDate: compagnyData?.insurance?.expiryDate || "",
                documents: compagnyData?.insurance?.documents || [],
            },
            certifications: compagnyData?.certifications || [],
        },
        onSubmit: async (values) => {
            try {
                await mutation.mutateAsync({ id: compagnyData._id, values });
            } catch (error) {
                console.error("Erreur lors de la modification :", error);
            }
        },
    });

    const { values } = formik
    console.log("INITIAL IMAGE:::", values);

    return (
        <div>
            <ReusableDialogStepsEdit
                triggerText="Modifier"
                dialogTitle="Modifier la Compagnie"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleModalOpen={() => setOpenDialog(true)}
            >
                <FormikProvider value={formik}>
                    <div className="w-full mx-auto flex items-center justify-center">
                        <div className="w-full max-w-sm">
                            <Steps steps={steps} currentStep={activeIndex} />
                        </div>
                    </div>

                    <div className="form-group mb-5">
                        {activeIndex === 0 && <StepOne formik={formik} uploadImages={uploadImages} />}
                        {activeIndex === 1 && <StepTwo formik={formik} />}
                        {activeIndex === 2 && <StepThree formik={formik} />}
                        {activeIndex === 3 && <StepFour formik={formik} />}
                    </div>

                    <DialogFooter>
                        <div className="flex justify-between w-full mt-0">
                            {activeIndex > 0 && (
                                <Button
                                    type="button"
                                    onClick={() => setActiveIndex(prev => prev - 1)}
                                    className="py-0 px-7 text-[0.7rem]"
                                >
                                    Précédent
                                </Button>
                            )}

                            {activeIndex < steps.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={() => setActiveIndex(prev => prev + 1)}
                                    className="py-0 px-7 text-[0.7rem]"
                                >
                                    Suivant
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="py-0 px-7 text-[0.7rem]"
                                    onClick={formik.handleSubmit}
                                >
                                    {mutation.isPending ? (
                                        <div className="flex items-center space-x-2">
                                            <ScaleLoader color="#ffffff" height={10} />
                                            <span>Encours...</span>
                                        </div>
                                    ) : (
                                        "Modifier"
                                    )}
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </FormikProvider>
            </ReusableDialogStepsEdit>
        </div>
    );
}
