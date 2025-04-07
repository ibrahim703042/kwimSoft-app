import { Button } from '../../components/ui/button'
import { useFormik } from 'formik';
import { useState } from 'react';
import ReusableDialogSteps from '../../component/utilitie/ReusableDialogSteps';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { API_ROUTE, API_ROUTE_UPLOAD } from '../../../config';
import axios, { AxiosError } from 'axios';
import { TransmissionType, OilType, FuelType, EngineType } from "../../../constants"
import ScaleLoader from "react-spinners/ScaleLoader";
import * as Yup from "yup";

const createDriver = async (values: any) => {
    console.log("DATA SENDER BUS>>>>>", values);
    const response = await axios.post(
        `${API_ROUTE}/buses`,
        values
    );
    return response.data;
};


const fetchDriver = async () => {
    const { data } = await axios.get(`${API_ROUTE}/drivers/company/67bc9002f682d26a7f7a9200`);
    return data;
};

export default function AddBus() {
    const [openDialog, setOpenDialog] = useState(false);
    const [step, setStep] = useState(1);
    const queryClient = useQueryClient();

    const [uploading, setUploading] = useState(false);

    const { data: driverData } = useQuery({
        queryKey: ["drivers"],
        queryFn: fetchDriver,
    });


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

    const driver = driverData?.data?.content || [];
    console.log("conducteuruuuuuuuuuuu", driver);

    // Mutation React Query pour envoyer les données
    const mutation = useMutation({
        mutationFn: createDriver,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le bus a été enregistré avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries(["buses"]);
            setOpenDialog(false);
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ message?: string | string[] }>;
            const backendMessage = axiosError.response?.data?.message;
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

    const validationSchema = Yup.object().shape({
        totalSeats: Yup.string().required("Le nombre de sièges est requis"),
        driver: Yup.string().required("Le conducteur est requis"),
        manufacture: Yup.string().required("Le Fabricant est requis"),
        brand: Yup.string().required("La Marque est requise"),
        modele: Yup.string().required("Le Modèle est requis"),
        vin: Yup.string().required("Le VIN est requis"),
        mileage: Yup.string().required("Le Kilométrage est requis"),
        make: Yup.string().required("La marque est requise"),
        registrationNumber: Yup.string().required("Le Numéro d'immatriculation est requis"),
        color: Yup.string().required("La couleur est requise"),
        year: Yup.string().required("L'année est requise"),
        totalBagsWeight: Yup.string().required("Le Poids total des sacs de moteur est requis"),
        totalAllowedBagsWeightPerClient: Yup.string().required("Le Poids total autorisé des sacs par client est requis"),
        engineDisplacement: Yup.string().required("La Cylindrée du moteur est requise"),
        fuelTankCapacity: Yup.string().required("La Capacité du réservoir de carburant est requise"),
        overageWeightPerKg: Yup.string().required("Le Tarif pour le poids excédentaire est requis"),
        emissionStandard: Yup.string().required("La Norme d'émission est requise"),
        maxPower: Yup.string().required("La Puissance maximale est requise"),
        maxTorque: Yup.string().required("Le Couple moteur maximal est requis"),
        licensePlate: Yup.string().required("Le plaque d'immatriculation est requis"),
    });

    const formik = useFormik({
        initialValues: {
            driver: "",
            totalSeats: "",
            manufacture: "",
            brand: "",
            modele: "",
            vin: "",
            mileage: "",
            make: "",
            registrationNumber: "",
            color: "",
            year: "",
            transmissionType: "",
            oil: "",
            fuelType: "",
            engineType: "",
            image: "",
            totalBagsWeight: "",
            engineDisplacement: "",
            fuelTankCapacity: "",
            overageWeightPerKg: "",
            emissionStandard: "",
            totalAllowedBagsWeightPerClient: 0,
            maxPower: 0,
            maxTorque: 0,
            licensePlate: "",
            lastMaintenanceDate: new Date().toISOString().split("T")[0],
            company: "67bc9002f682d26a7f7a9200",
        },
        validationSchema: validationSchema,
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
    console.log("values INITIALLLLLLLLL", values);


    return (
        <div>
            <ReusableDialogSteps
                dialogTitle="Bus"
                onSubmit={formik.handleSubmit}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                step={step}
                setStep={setStep} // Permet de naviguer entre les étapes
            >
                <form onSubmit={formik.handleSubmit}>
                    {step === 1 && (
                        <div className='grid grid-cols-12 gap-4'>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Conducteur  <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Select onValueChange={(value) => formik.setFieldValue("driver", value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un conducteur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {driver.map((driverItem: any) => (
                                                <SelectItem key={driverItem._id} value={driverItem._id}>
                                                    {`${driverItem.fullName}`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {formik.touched.driver && formik.errors.driver && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.driver}</p>
                                )}
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Modèle <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="modele"
                                    placeholder="Modèle"
                                    value={formik.values.modele}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.modele && formik.errors.modele && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.modele}</p>
                                )}
                            </div>
                            <div className='col-span-4'>
                                <Label htmlFor="terms" className="font-normal">Fabricant <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="manufacture"
                                    placeholder="Fabricant"
                                    value={formik.values.manufacture}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.manufacture && formik.errors.manufacture && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.manufacture}</p>
                                )}
                            </div>
                            <div className='col-span-4'>
                                <Label htmlFor="terms" className="font-normal">Marque <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="brand"
                                    placeholder="Marque"
                                    value={formik.values.brand}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.brand && formik.errors.brand && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.brand}</p>
                                )}
                            </div>

                            <div className="col-span-4">
                                <div className="col-span-12">
                                    <div className="mt-0">
                                        <Label htmlFor="terms" className="font-normal">
                                            Type de transmission
                                        </Label>
                                    </div>
                                    <Select onValueChange={(value) => formik.setFieldValue("transmissionType", value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {TransmissionType.map((compagnieItem) => (
                                                    <SelectItem key={compagnieItem.value} value={compagnieItem.value}>
                                                        {compagnieItem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="col-span-12">
                                    <div className="mt-0">
                                        <Label htmlFor="terms" className="font-normal">
                                            Type d'huile
                                        </Label>
                                    </div>
                                    <Select onValueChange={(value) => formik.setFieldValue("oil", value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {OilType.map((compagnieItem) => (
                                                    <SelectItem key={compagnieItem.value} value={compagnieItem.value}>
                                                        {compagnieItem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="col-span-12">
                                    <div className="mt-0">
                                        <Label htmlFor="terms" className="font-normal">
                                            Type de carburant
                                        </Label>
                                    </div>
                                    <Select onValueChange={(value) => formik.setFieldValue("fuelType", value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {FuelType.map((compagnieItem) => (
                                                    <SelectItem key={compagnieItem.value} value={compagnieItem.value}>
                                                        {compagnieItem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="col-span-12">
                                    <div className="mt-0">
                                        <Label htmlFor="terms" className="font-normal">
                                            Type de moteur
                                        </Label>
                                    </div>
                                    <Select onValueChange={(value) => formik.setFieldValue("engineType", value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {EngineType.map((compagnieItem) => (
                                                    <SelectItem key={compagnieItem.value} value={compagnieItem.value}>
                                                        {compagnieItem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>

                            <div className='col-span-4'>
                                <Label htmlFor="terms" className="font-normal">Make <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="make"
                                    placeholder="make"
                                    value={formik.values.make}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.make && formik.errors.make && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.make}</p>
                                )}
                            </div>
                            <div className='col-span-4'>
                                <Label htmlFor="terms" className="font-normal">Kilométrage (km)  <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="mileage"
                                    placeholder="Kilométrage"
                                    value={formik.values.mileage}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.mileage && formik.errors.mileage && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.mileage}</p>
                                )}
                            </div>

                            <div className='col-span-3'>
                                <Label htmlFor="terms" className="font-normal">VIN <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="vin"
                                    placeholder="VIN"
                                    value={formik.values.vin}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.vin && formik.errors.vin && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.vin}</p>
                                )}
                            </div>

                            <div className='col-span-3'>
                                <Label htmlFor="terms" className="font-normal">Nombre de sièges <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="number"
                                    name="totalSeats"
                                    placeholder="Nombre de sièges"
                                    value={formik.values.totalSeats}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.totalSeats && formik.errors.totalSeats && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.totalSeats}</p>
                                )}
                            </div>
                            <div className='col-span-3'>
                                <Label htmlFor="terms" className="font-normal">Couleur <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="color"
                                    placeholder="Couleur"
                                    value={formik.values.color}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.color && formik.errors.color && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.color}</p>
                                )}
                            </div>
                            <div className='col-span-3'>
                                <Label htmlFor="terms" className="font-normal">Année <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="number"
                                    name="year"
                                    placeholder="Année"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.year && formik.errors.year && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.year}</p>
                                )}
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Numéro d'immatriculation <span className="text-red-500 text-[0.7rem]">*</span></Label>
                                <Input
                                    type="text"
                                    name="registrationNumber"
                                    placeholder="Numéro d'immatriculation"
                                    value={formik.values.registrationNumber}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.registrationNumber && formik.errors.registrationNumber && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.registrationNumber}</p>
                                )}
                            </div>

                            <div className="col-span-6 mt-1">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="terms" className="font-normal">Photo de bus</Label>
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

                        </div>
                    )}

                    {step === 2 && (
                        <div className='grid grid-cols-12 gap-4'>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Poids total des sacs (kg)</Label>
                                <Input
                                    type="number"
                                    name="totalBagsWeight"
                                    placeholder="Ex: 50"
                                    value={formik.values.totalBagsWeight}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Poids total autorisé des sacs par client (kg)</Label>
                                {/* <Input
                                    type="text"
                                    name="totalAllowedBagsWeightPerClient"
                                    placeholder="Ex: 50"
                                    value={parseFloat(formik.values.totalAllowedBagsWeightPerClient)}
                                    onChange={formik.handleChange}
                                /> */}
                                <Input
                                    type="text"
                                    name="totalAllowedBagsWeightPerClient"
                                    placeholder="Ex: 50"
                                    value={formik.values.totalAllowedBagsWeightPerClient || ""}
                                    onChange={(e) => {
                                        // Assure-toi que la valeur entrée est un nombre
                                        const value = parseFloat(e.target.value);
                                        // Si ce n'est pas un nombre, on met 0, sinon on garde la valeur
                                        formik.setFieldValue("totalAllowedBagsWeightPerClient", isNaN(value) ? 0 : value);
                                    }}
                                />
                            </div>

                            <div className='col-span-4'>
                                <Label htmlFor="terms" className="font-normal">Cylindrée du moteur</Label>
                                <Input
                                    type="number"
                                    name="engineDisplacement"
                                    placeholder="Ex: 2.0L, 3000cc"
                                    value={formik.values.engineDisplacement}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Capacité du réservoir de carburant (litres)</Label>
                                <Input
                                    type="number"
                                    name="fuelTankCapacity"
                                    placeholder="Ex: 50 (litres)"
                                    value={formik.values.fuelTankCapacity}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Tarif pour le poids excédentaire (par kg)</Label>
                                <Input
                                    type="number"
                                    name="overageWeightPerKg"
                                    placeholder="Ex: 5 ($/kg)"
                                    value={formik.values.overageWeightPerKg}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-3'>
                                <Label htmlFor="terms" className="font-normal">Puissance maximale</Label>
                                <Input
                                    type="number"
                                    name="maxPower"
                                    placeholder="Ex: 150"
                                    value={formik.values.maxPower}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-3'>
                                <Label htmlFor="terms" className="font-normal">Couple moteur maximal </Label>
                                <Input
                                    type="number"
                                    name="maxTorque"
                                    placeholder="Ex: 150"
                                    value={formik.values.maxTorque}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Norme d'émission</Label>
                                <Input
                                    type="text"
                                    name="emissionStandard"
                                    placeholder="Ex: Euro 6, EPA Tier 3"
                                    value={formik.values.emissionStandard}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Plaque d'immatriculation</Label>
                                <Input
                                    type="text"
                                    name="licensePlate"
                                    placeholder=""
                                    value={formik.values.licensePlate}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.licensePlate && formik.errors.licensePlate && (
                                    <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.licensePlate}</p>
                                )}
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="terms" className="font-normal">Dernière maintenance</Label>
                                <Input
                                    type="date"
                                    name="lastMaintenanceDate"
                                    value={formik.values.lastMaintenanceDate ? new Date(formik.values.lastMaintenanceDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value).toISOString();
                                        formik.setFieldValue('lastMaintenanceDate', selectedDate);
                                    }}
                                />
                            </div>

                        </div>
                    )}
                    <div className="flex justify-between mt-4">
                        {step > 1 && (
                            <Button type="button" onClick={() => setStep(step - 1)}>
                                Précédente
                            </Button>
                        )}
                        {step < 2 && (
                            <Button type="button" onClick={() => setStep(step + 1)}>
                                Suivante
                            </Button>
                        )}
                        {step === 2 && (
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
                        )}
                    </div>
                </form>
            </ReusableDialogSteps>
        </div>
    );
}
