import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ReusableDialogSteps from "../../component/utilitie/ReusableDialogSteps";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "../../components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { API_ROUTE, API_ROUTE_PASSWORD, API_ROUTE_UPLOAD } from "../../../config";
import axios from "axios";
import { SEXES } from "../../../constants"
import ScaleLoader from "react-spinners/ScaleLoader";

const createDriver = async (values) => {
    const response = await axios.post(
        `${API_ROUTE_PASSWORD}/drivers`,
        values
    );
    return response.data;
};

export default function AddDriver() {

    const [openDialog, setOpenDialog] = useState(false);
    const [uploading, setUploading] = useState(false);

    const uploadImages = async (files, setFieldValue) => {
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file)); // Utiliser "files" pour plusieurs fichiers
            const response = await fetch(`${API_ROUTE_UPLOAD}/upload-files/images`, {
                method: "POST",
                body: formData, // Envoi du formData
            });
            const data = await response.json();
            if (data?.images?.length > 0) {
                const imageUrl = `${API_ROUTE_UPLOAD}/images/${data.images[0].url.split('/').pop()}`;
                console.log("URL GÉNÉRÉE :::::", imageUrl);
                setFieldValue("image", imageUrl);
            }
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploading(true);
            await uploadImages([file], formik.setFieldValue);
            setUploading(false);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values) => {
            console.log("Mutation en cours avec valeurs :", values);
            return await createDriver(values);
        },
        onSuccess: () => {
            console.log("Mutation terminée avec succès !");
            Swal.fire({
                title: "Succès!",
                text: "Le chauffeur a été enregistré avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries(["drivers"]);
            setOpenDialog(false);
        },
        onError: (error) => {
            console.error("Erreur dans la mutation :", error);
            Swal.fire({
                title: "Erreur!",
                text: "Une erreur est survenue. Veuillez réessayer.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });


    const validationSchema = Yup.object({
        fullName: Yup.string()
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Le nom complet ne doit contenir que des lettres")
            .required("Le nom est requis"),
        email: Yup.string()
            .required("L'adresse e-mail est obligatoire @gmail.com")
            .email("Veuillez entrer une adresse e-mail valide"),
        sexe: Yup.string().required("Sexe est requis"),
        nationality: Yup.string()
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "La nationalité ne doit contenir que des lettres")
            .required("La nationalité est requis"),
        adresse: Yup.string().required("Adresse est requise"),
        birthDate: Yup.date().required("Date de naissance est requise"),
        licenseNumber: Yup.string().matches(/^[A-Z0-9]+$/, "Doit contenir seulement des majuscules et chiffres").required("Numéro de permis est requis"),
        licenseDuration: Yup.number().positive("Doit être positif").integer("Doit être un nombre entier").required("Expiration du permis est requise"),
        phoneNumber: Yup.string()
            .matches(/^\+?[0-9]{10,15}$/, "Numéro de téléphone invalide")
            .notRequired(),
        begginingAt: Yup.date().required("Date d'entrée en fonction est requise"),
    });

    const formik = useFormik({
        initialValues: {
            fullName: "",
            licenseNumber: "",
            licenseDuration: "",
            phoneNumber: "",
            email: "",
            birthDate: "",
            company: "67bc9002f682d26a7f7a9200",
            image: "",
            sexe: "",
            nationality: "",
            begginingAt: "",
            adresse: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync(values);
                console.log("Mutation réussie !");
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    const { values } = formik
    useEffect(() => {
        console.log("INIT:::::::::", values);
    }, [values]);

    return (
        <div>
            <ReusableDialogSteps
                dialogTitle="Chauffeur"
                buttonDescr="Sauvegarder"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            >
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <Label htmlFor="terms" className="font-normal">Nom complet <span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                name="fullName"
                                placeholder=""
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.fullName}</p>}
                        </div>

                        <div className="col-span-6">
                            <Label htmlFor="terms" className="font-normal">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Exemple@gmail.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <div className="col-span-4">
                            <div className="col-span-12">
                                <div className="mt-0">
                                    <Label htmlFor="terms" className="font-normal">
                                        Sexe <span className="text-red-500">*</span>
                                    </Label>
                                </div>
                                <Select onValueChange={(value) => formik.setFieldValue("sexe", value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un pays" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {SEXES.map((compagnieItem) => (
                                                <SelectItem key={compagnieItem.value} value={compagnieItem.value}>
                                                    {compagnieItem.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {formik.touched.sexe && formik.errors.sexe && <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.sexe}</p>}
                            </div>
                        </div>

                        <div className="col-span-4">
                            <Label htmlFor="terms" className="font-normal">Nationalité <span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                name="nationality"
                                placeholder=""
                                value={formik.values.nationality}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.nationality && formik.errors.nationality && <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.nationality}</p>}

                        </div>
                        <div className="col-span-4">
                            <Label htmlFor="terms" className="font-normal">Adresse complet <span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                name="adresse"
                                placeholder=""
                                value={formik.values.adresse}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <div className="col-span-6">
                            <Label htmlFor="terms" className="font-normal">Date de naissance <span className="text-red-500">*</span></Label>
                            <Input
                                type="date"
                                name="birthDate"
                                value={formik.values.birthDate ? new Date(formik.values.birthDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value).toISOString();
                                    formik.setFieldValue('birthDate', selectedDate);
                                }}
                            />
                        </div>
                        <div className="col-span-6">
                            <Label htmlFor="terms" className="font-normal">Numéro de permis  <span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                name="licenseNumber"
                                placeholder="Majuscules (A-Z) et des chiffres (0-9)"
                                value={formik.values.licenseNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className="col-span-6">
                            <Label htmlFor="terms" className="font-normal">Expiration du permis (ans) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                name="licenseDuration"
                                placeholder=""
                                value={formik.values.licenseDuration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                        </div>
                        <div className="col-span-6">
                            <Label htmlFor="terms" className="font-normal">Téléphone</Label>
                            <Input
                                type="text"
                                name="phoneNumber"
                                placeholder=""
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.phoneNumber}</p>}
                        </div>

                        <div className="col-span-6">
                            <Label>Entré en fonction le <span className="text-red-500">*</span></Label>
                            <Input
                                type="date"
                                name="begginingAt"
                                min="2025-02-14"
                                value={formik.values.begginingAt ? new Date(formik.values.begginingAt).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value).toISOString();
                                    formik.setFieldValue('begginingAt', selectedDate);
                                }}
                            />
                        </div>

                        <div className="col-span-6 mt-2">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Photo</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    onBlur={formik.handleBlur}
                                />
                                {uploading && <p className="text-sm text-gray-500">Upload en cours...</p>}
                            </div>
                        </div>
                        <div className="col-span-12 flex justify-end">
                            <Button type="submit"
                                disabled={mutation.isPending}
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
                        </div>
                    </div>
                </form>
            </ReusableDialogSteps>
        </div>
    );
}
