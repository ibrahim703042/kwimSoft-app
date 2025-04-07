
import { Button } from '../../components/ui/button'
import { useFormik } from 'formik';
import { useState } from 'react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { API_ROUTE } from '../../../config';
import axios from 'axios';
import ReusableDialogStepsEdit from '../../component/utilitie/ReusableDialogStepsEdit';

// Fonction API pour enregistrer bus
const updateBus = async ({ id, values }) => {
    const response = await axios.delete(
        `${API_ROUTE}/buses/${id}`,
        values
    );
    return response.data;
};

// Fonction pour récupérer les compagnies
const fetchCompagnie = async () => {
    const { data } = await axios.get(`${API_ROUTE}/companies`);
    return data;
};

// Fonction pour récupérer les conducteurs
const fetchDriver = async () => {
    const { data } = await axios.get(`${API_ROUTE}/drivers`);
    return data;
};

export default function EditBus({ BusData, openDialog, setOpenDialog }) {
    const [step, setStep] = useState(1);

    const { data: responseData } = useQuery({
        queryKey: ["compagnie"],
        queryFn: fetchCompagnie,
    });

    const { data: driverData } = useQuery({
        queryKey: ["drivers"],
        queryFn: fetchDriver,
    });

    console.log("BusData", BusData);


    const compagni = responseData?.data?.content || [];
    const driver = driverData?.data?.content || [];

    // Mutation React Query pour envoyer les données
    const mutation = useMutation({
        mutationFn: updateBus,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le bus a été enregistré avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
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
            registrationNumber: BusData?.registrationNumber,
            manufacture: BusData?.manufacture,
            modele: BusData?.modele,
            make: BusData?.make,
            capacity: BusData?.capacity,
            brand: BusData?.brand,
            year: BusData?.year,
            color: BusData?.color,
            vin: BusData?.vin,
            mileage: BusData?.mileage,
            licensePlate: BusData?.licensePlate,
            totalSeats: BusData?.totalSeats,
            lastMaintenanceDate: BusData?.lastMaintenanceDate,
            totalBagsWeight: BusData?.totalBagsWeight,
            totalAllowedBagsWeightPerClient: BusData?.totalAllowedBagsWeightPerClient,
            overageWeightPerKg: BusData?.overageWeightPerKg,
            driver: BusData?.driver?._id,
            company: BusData?.company?._id || "",
        },
        onSubmit: async (values) => {
            try {
                await mutation.mutateAsync({ id: BusData._id, values });
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    return (
        <div>
            <ReusableDialogStepsEdit
                triggerText="Ajouter"
                dialogTitle="Bus"
                buttonDescr="Sauvegarder"
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
                                <Label htmlFor="company">Compagnie</Label>
                                <Select
                                    onValueChange={(value) => formik.setFieldValue("company", value)}
                                    value={formik.values.company} // Vérifie que la valeur est un identifiant (_id) du pays
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un pays" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {compagni.map((countryItem) => (
                                                <SelectItem key={countryItem._id} value={countryItem._id}>
                                                    {countryItem.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="driver">Conducteur</Label>
                                <Select
                                    onValueChange={(value) => formik.setFieldValue("driver", value)}
                                    value={formik.values.driver} // Vérifie que la valeur est un identifiant (_id) du pays
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un pays" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {driver.map((countryItem) => (
                                                <SelectItem key={countryItem._id} value={countryItem._id}>
                                                    {`${countryItem.firstName} ${countryItem.lastName}`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                            </div>
                            <div className='col-span-4'>
                                <Label htmlFor="capacity">Capacité</Label>
                                <Input
                                    type="text"
                                    name="capacity"
                                    placeholder="Capacité"
                                    value={formik.values.capacity}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-4'>
                                <Label htmlFor="manufacture">Fabricant</Label>
                                <Input
                                    type="text"
                                    name="manufacture"
                                    placeholder="Fabricant"
                                    value={formik.values.manufacture}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-4'>
                                <Label htmlFor="brand">Marque</Label>
                                <Input
                                    type="text"
                                    name="brand"
                                    placeholder="Marque"
                                    value={formik.values.brand}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="model">Modèle</Label>
                                <Input
                                    type="text"
                                    name="modele"
                                    placeholder="Modèle"
                                    value={formik.values.modele}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="vin">VIN</Label>
                                <Input
                                    type="text"
                                    name="vin"
                                    placeholder="VIN"
                                    value={formik.values.vin}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="mileage">Kilométrage</Label>
                                <Input
                                    type="text"
                                    name="mileage"
                                    placeholder="Kilométrage"
                                    value={formik.values.mileage}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="mileage">Make</Label>
                                <Input
                                    type="text"
                                    name="make"
                                    placeholder="make"
                                    value={formik.values.make}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
                                <Input
                                    type="text"
                                    name="licensePlate"
                                    placeholder="Plaque d'immatriculation"
                                    value={formik.values.licensePlate}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className='grid grid-cols-12 gap-4'>
                            <div className='col-span-6'>
                                <Label htmlFor="registrationNumber">Numéro d'immatriculation</Label>
                                <Input
                                    type="text"
                                    name="registrationNumber"
                                    placeholder="Numéro d'immatriculation"
                                    value={formik.values.registrationNumber}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="year">Année</Label>
                                <Input
                                    type="number"
                                    name="year"
                                    placeholder="Année"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="totalBagsWeight">Poids total des bagages</Label>
                                <Input
                                    type="text"
                                    name="totalBagsWeight"
                                    placeholder="Poids total des bagages"
                                    value={formik.values.totalBagsWeight}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-3'>
                                <Label htmlFor="totalAllowedBagsWeightPerClient" className="whitespace-nowrap">Bagages autorisés</Label>
                                <Input
                                    type="text"
                                    name="totalAllowedBagsWeightPerClient"
                                    placeholder="Bagages autorisés"
                                    value={formik.values.totalAllowedBagsWeightPerClient}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-3'>
                                <Label htmlFor="color">Couleur</Label>
                                <Input
                                    type="text"
                                    name="color"
                                    placeholder="Couleur"
                                    value={formik.values.color}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className='col-span-6'>
                                <Label htmlFor="totalSeats">Nombre de sièges</Label>
                                <Input
                                    type="number"
                                    name="totalSeats"
                                    placeholder="Nombre de sièges"
                                    value={formik.values.totalSeats}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="overageWeightPerKg">Surcharge par kilogramme</Label>
                                <Input
                                    type="number"
                                    name="overageWeightPerKg"
                                    placeholder="Surcharge par kilogramme"
                                    value={formik.values.overageWeightPerKg}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-6'>
                                <Label htmlFor="lastMaintenanceDate">Dernière maintenance</Label>
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
                            <Button type="submit" disabled={mutation.isLoading}>
                                {mutation.isLoading ? "Modification..." : "Modifier"}
                            </Button>
                        )}
                    </div>
                </form>
            </ReusableDialogStepsEdit>
        </div>
    );
}
