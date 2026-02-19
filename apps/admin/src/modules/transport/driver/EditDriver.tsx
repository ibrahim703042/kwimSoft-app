import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { API_ROUTE, API_ROUTE_UPLOAD } from "@/config";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import { SEXES } from "@/types/constants"
import ReusableDialogStepsEdit from "@/components/utilitie/ReusableDialogStepsEdit";

interface DriverFormValues {
    fullName: string;
    licenseNumber: string;
    licenseDuration: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    company: string;
    image: string;
    sexe: string;
    nationality: string;
    begginingAt: string;
    adresse: string;
}

interface DriverData {
    _id: string;
    fullName?: string;
    licenseNumber?: string;
    licenseDuration?: string;
    phoneNumber?: string;
    email?: string;
    birthDate?: string;
    company?: { _id?: string; name?: string };
    image?: string;
    sexe?: string;
    nationality?: string;
    begginingAt?: string;
    adresse?: string;
}

interface EditDriverProps {
    DriverData: DriverData | null;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

const updateDriver = async ({ id, values }: { id: string; values: DriverFormValues }) => {
    const response = await axios.put(
        `${API_ROUTE}/drivers/${id}`,
        values
    );
    return response.data;
};


export default function EditDriver({ DriverData, openDialog, setOpenDialog }: EditDriverProps) {
    const queryClient = useQueryClient();

    console.log("DriverData", DriverData);
    const [uploading, setUploading] = useState(false);

    if (!DriverData) {
        return null;
    }

    const uploadImages = async (files: File[], setFieldValue: (field: string, value: any) => void) => {
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            await uploadImages([file], formik.setFieldValue);
            setUploading(false);
        }
    };

    // Mutation React Query pour envoyer les données
    const mutation = useMutation({
        mutationFn: updateDriver,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le chauffeur a été modifier avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            setOpenDialog(false);
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Une erreur est survenue. Veuillez réessayer.",
                icon: "error",
                confirmButtonText: "OK",
            });
            setOpenDialog(false)
        },
    });

    const formik = useFormik({
        initialValues: {
            fullName: DriverData?.fullName || "",
            licenseNumber: DriverData?.licenseNumber || "",
            licenseDuration: DriverData?.licenseDuration || "",
            phoneNumber: DriverData?.phoneNumber || "",
            email: DriverData?.email || "",
            birthDate: DriverData?.birthDate || "",
            company: DriverData?.company?._id || "",
            image: DriverData?.image || "",
            sexe: DriverData?.sexe || "",
            nationality: DriverData?.nationality || "",
            begginingAt: DriverData?.begginingAt || "",
            adresse: DriverData?.adresse || "",
        },
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync({ id: DriverData._id, values });
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    const { values } = formik
    console.log("INIT:::::::::", values);
    useEffect(() => {
    }, [values]);

    return (
        <div>
            <ReusableDialogStepsEdit
                dialogTitle="Chauffeur"
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
                            {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-[0.7rem] mt-1">{String(formik.errors.fullName)}</p>}
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
                                <Select
                                    value={formik.values.sexe} // Assure que la valeur actuelle est affichée
                                    onValueChange={(value) => formik.setFieldValue("sexe", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un sexe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {SEXES.map((sexeItem) => (
                                                <SelectItem key={sexeItem.value} value={sexeItem.value}>
                                                    {sexeItem.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {formik.touched.sexe && formik.errors.sexe && <p className="text-red-500 text-[0.7rem] mt-1">{String(formik.errors.sexe)}</p>}
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
                            {formik.touched.nationality && formik.errors.nationality && <p className="text-red-500 text-[0.7rem] mt-1">{String(formik.errors.nationality)}</p>}

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
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="text-red-500 text-[0.7rem] mt-1">{String(formik.errors.phoneNumber)}</p>}
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
