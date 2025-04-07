
import { Button } from '../../components/ui/button'
import { useFormik } from 'formik';
import { useState } from 'react';
import ReusableDialogSteps from '../../component/utilitie/ReusableDialogSteps';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { API_ROUTE } from '../../../config';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import { TripType } from "../../../constants"
import { Eye } from 'react-bootstrap-icons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useParams } from 'react-router-dom';
import ReusableDialogStepsEdit from '../../component/utilitie/ReusableDialogStepsEdit';

// Fonction API pour enregistrer bus
const createTrip = async ({ id, values }) => {
    const response = await axios.patch(
        `${API_ROUTE}/trip/${id}`,
        values
    );
    return response.data;
};

const fetchCompagnie = async () => {
    const { data } = await axios.get(`${API_ROUTE}/companies`);
    return data;
};

const fetchBus = async () => {
    const { data } = await axios.get(`${API_ROUTE}/buses`);
    return data;
};

const fetchCountries = async () => {
    const { data } = await axios.get(`${API_ROUTE}/country`);
    return data;
};

// Fonction pour récupérer les conducteurs
const fetchDriver = async () => {
    const { data } = await axios.get(`${API_ROUTE}/drivers`);
    return data;
};

export default function EditTrip({ openDialog, setOpenDialog, edit }) {
    const [step, setStep] = useState(1); // Étape actuelle du formulaire
    const [stop, setStop] = useState("");
    const [stopsList, setStopsList] = useState([]);
    const [basePrice, setBasePrice] = useState([]);
    const [price, setPrice] = useState({ basePrice: "", country: "" });


    const handleStopArretChange = (e) => {
        const { name, value } = e.target;
        setStop((prevState) => ({
            ...prevState,
            [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) : value
        }));
    };

    const { data: responseDatas, isLoading: isCountries, error: errorCountrie } = useQuery({
        queryKey: ["countries"],
        queryFn: fetchCountries,
    });

    const countries = responseDatas?.data?.content || [];

    const addStop = () => {
        const newStop = {
            stationName: stop.stationName,
            coordinates: [stop.latitude, stop.longitude],  // Assurez-vous de capturer les coordonnées
            scheduledArrivalDuration: stop.scheduledArrivalDuration,
            scheduledDepartureDuration: stop.scheduledDepartureDuration
        };

        const newStops = [...stopsList, newStop];
        setStopsList(newStops);
        formik.setFieldValue("stopovers", newStops);
        setStop({
            stationName: "",
            latitude: "",
            longitude: "",
            scheduledArrivalDuration: "",
            scheduledDepartureDuration: ""
        });
    };

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["compagnies"],
        queryFn: fetchCompagnie,
    });

    const { data: responseBuses, isLoading: isLoadingBus, error: errorBus } = useQuery({
        queryKey: ["buses"],
        queryFn: fetchBus,
    });

    const bus = responseBuses?.data?.content || [];
    const compagnies = responseData?.data?.content || [];

    const toggleSelection = (id) => {
        const newBusSelection = formik.values.bus.includes(id)
            ? formik.values.bus.filter(busId => busId !== id)
            : [...formik.values.bus, id];

        formik.setFieldValue("bus", newBusSelection);
    };

    // Mutation React Query pour envoyer les données
    const mutation = useMutation({
        mutationFn: createTrip,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le bus a été enregistrée avec succès.",
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
            designation: edit?.designation || "",
            tripType: edit?.tripType || "",

            departureStation: {
                name: edit?.departureStation?.name || "",
                city: edit?.departureStation?.city || "",
                state: edit?.departureStation?.state || "",
                country: edit?.departureStation?.country || "",
                postalCode: edit?.departureStation?.postalCode || "",
                address: edit?.departureStation?.address || "",
                location: {
                    type: edit.departureStation.location.type,
                    coordinates: edit.departureStation.location.coordinates
                }
            },

            arrivalStation: {
                name: edit?.arrivalStation?.name || "",
                city: edit?.arrivalStation?.city || "",
                state: edit?.arrivalStation?.state || "",
                country: edit?.arrivalStation?.country || "",
                postalCode: edit?.arrivalStation?.postalCode || "",
                address: edit?.arrivalStation?.address || "",
                location: {
                    type: edit.arrivalStation.location.type,
                    coordinates: edit.arrivalStation.location.coordinates
                }
            },
            departureTime: edit?.departureTime || "",
            arrivalTime: edit?.arrivalTime || "",
            departureDate: edit?.departureDate || "",
            arrivalDate: edit?.arrivalDate || "",
            distance: edit?.distance || "",
            currency: edit?.currency || "",
            amenities: [],
            basePrice: [
                {
                    amount: edit?.basePrice?.amount || "",
                    country: edit?.basePrice?.country || ""
                }
            ],

            notes: edit?.notes || "",
            bus: [],
            company: edit?.company?._id || "",
            recurringDays: [],
            duration: edit?.duration || ""

        },
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync({ id: edit?._id, values });
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    const addBasePrice = () => {
        const newPrice = {
            amount: parseFloat(price.amount),
            country: price.country,
        };

        const updatedBasePrice = [...basePrice, newPrice];
        setBasePrice(updatedBasePrice);
        formik.setFieldValue("basePrice", updatedBasePrice);
        setPrice({ amount: "", country: "" });
    };

    const getCountryName = (countryId) => {
        const country = countries.find(c => c._id === countryId);
        return country ? country.name.common : "Unknown";
    };

    const deleteBasePrice = (index) => {
        const updatedBasePrice = basePrice.filter((_, i) => i !== index);
        setBasePrice(updatedBasePrice);
        formik.setFieldValue("basePrice", updatedBasePrice);
    };

    const { values } = formik
    console.log("INITIAL::::::::", values);

    console.log("EDITE DATA >>>>>>>>>>>>>", edit);


    return (
        <div>
            <ReusableDialogStepsEdit
                triggerText="Ajouter"
                dialogTitle="Trip"
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
                                <div className='mb-0'>
                                    <Label className="block text-sm font-medium">Type trajet</Label>
                                </div>
                                <Select
                                    onValueChange={(value) => formik.setFieldValue("tripType", value)}
                                    value={formik.values.tripType}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {TripType.map((countryItem) => (
                                                <SelectItem key={countryItem.value} value={countryItem.value}>
                                                    {countryItem.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-6">
                                <Label className="block text-sm font-medium">Bus</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {formik.values.bus.length > 0 ? bus.filter(b => formik.values.bus.includes(b._id)).map(b => b.modele).join(", ") : "Sélectionnez..."}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-2 w-full">
                                        {bus.map((option) => (
                                            <div
                                                key={option._id}
                                                className="flex w-full  items-center gap-2 cursor-pointer px-2 hover:bg-gray-100 rounded"
                                                onClick={() => toggleSelection(option._id)}
                                            >
                                                <Checkbox
                                                    checked={formik.values.bus.includes(option._id)}
                                                />
                                                {option.modele}
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>


                                {formik.touched.bus && formik.errors.bus && (
                                    <div className="text-red-500 text-sm">{formik.errors.bus}</div>
                                )}
                            </div>
                            <div className="col-span-6">
                                <Label>Gare de départ</Label>
                                <Input
                                    type="text"
                                    name="departureStation.name"
                                    placeholder="Nom"
                                    value={formik.values.departureStation.name}
                                    onChange={formik.handleChange}
                                />
                                <div className='mt-1'>
                                    <Select
                                        onValueChange={(value) => formik.setFieldValue("departureStation.country", value)}
                                        value={formik.values.departureStation.country}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner un pays" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {countries.map((countryItem) => (
                                                    <SelectItem key={countryItem._id} value={countryItem._id}>
                                                        {countryItem.name.common}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="departureStation.city"
                                        placeholder="Ville"
                                        value={formik.values.departureStation.city}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="departureStation.state"
                                        placeholder="station"
                                        value={formik.values.departureStation.state}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="departureStation.postalCode"
                                        placeholder="code trajet"
                                        value={formik.values.departureStation.postalCode}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <Input
                                        type="number"
                                        placeholder="Longitude"
                                        value={formik.values.departureStation.location.coordinates[0]}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                "departureStation.location.coordinates[0]",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Latitude"
                                        value={formik.values.departureStation.location.coordinates[1]}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                "departureStation.location.coordinates[1]",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </div>

                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="departureStation.address"
                                        placeholder="Adresse"
                                        value={formik.values.departureStation.address}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-span-6">
                                <Label>Gare d’arrivée</Label>
                                <Input
                                    type="text"
                                    name="arrivalStation.name"
                                    placeholder="Nom"
                                    value={formik.values.arrivalStation.name}
                                    onChange={formik.handleChange}
                                />
                                <div className='mt-1'>
                                    <Select
                                        onValueChange={(value) => formik.setFieldValue("arrivalStation.country", value)}
                                        value={formik.values.arrivalStation.country}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner un pays" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {countries.map((countryItem) => (
                                                    <SelectItem key={countryItem._id} value={countryItem._id}>
                                                        {countryItem.name.common}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="arrivalStation.city"
                                        placeholder="Ville"
                                        value={formik.values.arrivalStation.city}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="arrivalStation.state"
                                        placeholder="station"
                                        value={formik.values.arrivalStation.state}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="arrivalStation.postalCode"
                                        placeholder="code trajet"
                                        value={formik.values.arrivalStation.postalCode}
                                        onChange={formik.handleChange}
                                    />
                                </div>


                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <Input
                                        type="number"
                                        placeholder="Longitude"
                                        value={formik.values.arrivalStation.location.coordinates[0]}
                                        onChange={(e) =>
                                            formik.setFieldValue("arrivalStation.location.coordinates[0]", parseFloat(e.target.value))
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Latitude"
                                        value={formik.values.arrivalStation.location.coordinates[1]}
                                        onChange={(e) =>
                                            formik.setFieldValue("arrivalStation.location.coordinates[1]", parseFloat(e.target.value))
                                        }
                                    />
                                </div>
                                <div className='mt-1'>
                                    <Input
                                        type="text"
                                        name="arrivalStation.address"
                                        placeholder="Adresse"
                                        value={formik.values.arrivalStation.address}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>


                        </div>
                    )}

                    {step === 2 && (
                        <div className='grid grid-cols-12 gap-4'>
                            <div className="col-span-6">
                                <Label>Designation</Label>
                                <Input
                                    type="text"
                                    name="designation"
                                    placeholder="Designation"
                                    value={formik.values.designation}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-span-6">
                                <Label>Note</Label>
                                <Input
                                    type="text"
                                    name="notes"
                                    placeholder="Note"
                                    value={formik.values.notes}
                                    onChange={formik.handleChange}
                                />
                            </div>


                            <div className="col-span-6">
                                <Label>Distance (km)</Label>
                                <Input
                                    type="number"
                                    name="distance"
                                    placeholder="Distance"
                                    value={formik.values.distance}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-span-6">
                                <Label>duration</Label>
                                <Input
                                    type="number"
                                    name="duration"
                                    placeholder="Durée"
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='col-span-12'>
                                <div className='grid grid-cols-12 gap-4'>
                                    <div className="col-span-5">
                                        <Label>Prix de base</Label>
                                        <Input
                                            type="number"
                                            name="price.amount"
                                            placeholder="Prix"
                                            value={price.amount}
                                            onChange={(e) => setPrice({ ...price, amount: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-5">
                                        <Label>Pays</Label>
                                        <Select
                                            onValueChange={(value) => setPrice({ ...price, country: value })}
                                            value={price.country}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner un pays" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {countries.map((countryItem) => (
                                                        <SelectItem key={countryItem._id} value={countryItem._id}>
                                                            {countryItem.name.common}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='col-span-2'>
                                        <div className='mt-6 flex items-center gap-3'>
                                            <Button type="button" onClick={addBasePrice}> + </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline"><Eye /></Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Base prix</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-0">
                                                        {basePrice.length > 0 && (
                                                            <table className="mt-4 w-full border-collapse border border-gray-300">
                                                                <thead>
                                                                    <tr className="bg-gray-200">
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">#</th>
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Prix de base</th>
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Pays</th>
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {basePrice.map((item, index) => (
                                                                        <tr key={index} className="text-center">
                                                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                                            <td className="border border-gray-300 px-4 py-2 text-[0.8rem]">{item.basePrice}</td>
                                                                            <td className="border border-gray-300 px-4 py-2 text-[0.8rem]">{getCountryName(item.country)}</td>
                                                                            <Button
                                                                                type="button"
                                                                                className="bg-red-500 my-1 text-[0.8rem] text-white px-3 py-0 rounded"
                                                                                onClick={() => deleteBasePrice(index)}
                                                                            >
                                                                                X
                                                                            </Button>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='col-span-12'>
                                <div className='col-span-12'>
                                    <div className='flex w-full items-center gap-3'>
                                        <div>
                                            <Label>Nom de l'arrêt</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nom de l'arrêt"
                                                className="mt-1"
                                                name="stationName"
                                                value={stop.stationName}
                                                onChange={handleStopArretChange}
                                            />
                                        </div>
                                        <div className='col-span-6'>

                                            <Input
                                                type="number"
                                                placeholder="Latitude"
                                                name="latitude"
                                                value={stop.latitude}
                                                onChange={handleStopArretChange}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Longitude"
                                                name="longitude"
                                                value={stop.longitude}
                                                onChange={handleStopArretChange}
                                            />
                                        </div>
                                        <div className='col-span-6'>
                                            <Input
                                                type="text"
                                                placeholder="Durée d'arrivée prévue"
                                                name="scheduledArrivalDuration"
                                                value={stop.scheduledArrivalDuration}
                                                onChange={handleStopArretChange}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Durée de départ prévue"
                                                name="scheduledDepartureDuration"
                                                value={stop.scheduledDepartureDuration}
                                                onChange={handleStopArretChange}
                                            />
                                        </div>
                                        <div className='mt-7 flex gap-2'>
                                            <Button type="button" onClick={addStop}> + </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline"><Eye /></Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Arrêts</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-0">
                                                        {stopsList.length > 0 && (
                                                            <table className="mt-4 w-full border-collapse border border-gray-300">
                                                                <thead>
                                                                    <tr className="bg-gray-200">
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">#</th>
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Arrêt</th>
                                                                        <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {stopsList.map((item, index) => (
                                                                        <tr key={index} className="text-center">
                                                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                                            <td className="border border-gray-300 px-4 py-2 text-[0.8rem]">{item.stationName}</td>
                                                                            <td className="border border-gray-300 px-4 py-2">
                                                                                <Button
                                                                                    type="button"
                                                                                    className="bg-red-500 text-[0.7rem] text-white px-4 py-0 rounded"
                                                                                    onClick={() => {
                                                                                        const newStops = stopsList.filter((_, i) => i !== index);
                                                                                        setStopsList(newStops);
                                                                                        formik.setFieldValue("stopovers", newStops);
                                                                                    }}
                                                                                >
                                                                                    X
                                                                                </Button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    <div className="flex justify-between mt-2">
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
                                {mutation.isLoading ? "Modifier..." : "Modifier"}
                            </Button>
                        )}
                    </div>
                </form>
            </ReusableDialogStepsEdit>
        </div>
    );
}
