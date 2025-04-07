
import { Button } from '../../components/ui/button'
import { useFormik } from 'formik';
import { useState } from 'react';
import ReusableDialogSteps from '../../component/utilitie/ReusableDialogSteps';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { API_ROUTE } from '../../../config';
import axios from 'axios';
import { TripType } from "../../../constants"
import { Eye } from 'react-bootstrap-icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import ScaleLoader from "react-spinners/ScaleLoader";
import * as Yup from "yup";

const createTrip = async (values) => {
  console.log("DATA SENDER>>>>>99999999999999999", values);
  const response = await axios.post(
    `${API_ROUTE}/trips`,
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

const fetchDriver = async () => {
  const { data } = await axios.get(`${API_ROUTE}/drivers`);
  return data;
};

const fetchStation = async () => {
  const { data } = await axios.get(`${API_ROUTE}/stations/no-pagination/company/67bc9002f682d26a7f7a9200`);
  return data;
};

export default function AddTrip() {
  const [openDialog, setOpenDialog] = useState(false);
  const [step, setStep] = useState(1); // Étape actuelle du formulaire
  const [stop, setStop] = useState("");
  const [stopsList, setStopsList] = useState([]);
  const [basePrice, setBasePrice] = useState([]);
  const [price, setPrice] = useState({ basePrice: "", country: "" });
  const prixCount = basePrice?.length

  const formatPrice = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("fr-FR").format(value);
  };

  const { data: responsStation, isLoading: isLoadingStation, error: errorStattion } = useQuery({
    queryKey: ["statations"],
    queryFn: fetchStation,
  });

  const Station = responsStation?.data || [];

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
      station: stop.station,
      designation: stop.designation,
      duration: parseFloat(stop.duration) || 0,
      distance: parseFloat(stop.distance) || 0
    };

    const newStops = [...stopsList, newStop];
    setStopsList(newStops);
    formik.setFieldValue("routes", newStops);
    setStop({
      station: "",
      designation: "",
      duration: "",
      distance: ""
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
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries(["trip"]);
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

  const validationSchema = Yup.object().shape({
    designation: Yup.string().required("Le designation est requis"),
    tripType: Yup.string().required("Le Type trajet est requis"),
    departureStation: Yup.string().required("Le Station de départ est requis"),
    arrivalStation: Yup.string().required("Le Station d'arrivée est requis"),
  });

  const formik = useFormik({
    initialValues: {
      designation: "",
      tripType: "",
      departureStation: "",
      arrivalStation: "",
      distance: "",
      notes: "",
      duration: "",
      company: "67bc9002f682d26a7f7a9200",
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


  const getCountryName = (countryId: any) => {
    const country = countries.find(c => c._id === countryId);
    return country ? country.name.common : "Unknown";
  };

  const getStationName = (stationId: any) => {
    const station = Station.find(c => c._id === stationId);
    return station ? station.state : "Unknown";
  };


  const deleteBaseArret = (index) => {
    const updatedBaseArrret = stopsList.filter((_, i) => i !== index);
    setBasePrice(updatedBaseArrret);
    formik.setFieldValue("basePrice", updatedBaseArrret);
  };

  const { values } = formik
  console.log("INITIAL::::::::", values);

  return (
    <div>
      <ReusableDialogSteps
        triggerText="Ajouter"
        dialogTitle="Trip"
        buttonDescr="Sauvegarder"
        onSubmit={formik.handleSubmit}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        step={step}
        setStep={setStep}
      >
        <form onSubmit={formik.handleSubmit}>
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
              {formik.touched.tripType && formik.errors.tripType && (
                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.tripType}</p>
              )}
            </div> <br />

            <div className='col-span-6'>
              <Label className="block text-sm font-medium">Station de départ</Label>
              <div className='mt-1'>
                <Select
                  onValueChange={(value) => formik.setFieldValue("departureStation", value)}
                  value={formik.values.departureStation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Station de départ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Station.map((countryItem) => (
                        <SelectItem key={countryItem._id} value={countryItem._id}>
                          {countryItem.state}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.departureStation && formik.errors.departureStation && (
                  <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.departureStation}</p>
                )}
              </div>
            </div>
            <div className='col-span-6'>
              <Label className="block text-sm font-medium">Station d'arrivée</Label>
              <div className='mt-1'>
                <Select
                  onValueChange={(value) => formik.setFieldValue("arrivalStation", value)}
                  value={formik.values.arrivalStation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Station de départ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Station.map((countryItem) => (
                        <SelectItem key={countryItem._id} value={countryItem._id}>
                          {countryItem.state}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.arrivalStation && formik.errors.arrivalStation && (
                  <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.arrivalStation}</p>
                )}
              </div>
            </div>
            <div className='col-span-12 mb-0 my-5'>
              <div className='flex items-center gap-2'>
                <p className='text-sm whitespace-nowrap'>Données complémentaires</p>
                <div className='h-[1px] bg-[#00000059] w-full'></div>
              </div>
            </div>

            <div className="col-span-6">
              <Label>Designation</Label>
              <Input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formik.values.designation}
                onChange={formik.handleChange}
              />
              {formik.touched.designation && formik.errors.designation && (
                <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.designation}</p>
              )}
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
              <Label>duration (Heure)</Label>
              <Input
                type="number"
                name="duration"
                placeholder="Durée"
                value={formik.values.duration}
                onChange={formik.handleChange}
              />
            </div>
            <div className='col-span-12'>
              <p className='font-semibold text-[0.8rem]'>Ajouter les stop</p>
              <hr className='my-2' />
            </div>

            <div className='col-span-6'>
              <Label>Nom de l'arrêt</Label>

              <Select
                onValueChange={(value) => {
                  setStop((prevStop) => ({ ...prevStop, station: value })); // Met à jour stop.station
                  formik.setFieldValue("station", value);
                }}
                value={stop.station} // Utilisation correcte de stop.station
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Station de départ">
                    {Station.find((item) => item._id === stop.station)?.state || "Station de départ"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Station.map((stationItem) => (
                      <SelectItem key={stationItem._id} value={stationItem._id}>
                        {stationItem.state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='col-span-3'>
              <Label>Designation (H)</Label>
              <Input
                type="text"
                placeholder=""
                name="designation"
                value={stop.designation}
                onChange={handleStopArretChange}
              />
            </div>

            <div className='col-span-3 '>
              <div className='mt-5 flex justify-end gap-2'>
                <Button type="button" onClick={addStop}> + </Button>
                <Dialog>
                  <DialogTrigger asChild className='relative'>
                    <Button variant="outline"><Eye />
                      <div className='absolute top-0 right-0 bg-green-400  rounded-full px-[4px] text-[0.7rem]'>{stopsList.length}</div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Base prix</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-0">
                      {stopsList.length > 0 && (
                        <table className="mt-4 w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">#</th>
                              <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Arrêt</th>
                              <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Distance</th>
                              <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Durée</th>
                              <th className="border border-gray-300 px-4 py-2 text-[0.7rem]">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stopsList.map((item, index) => (
                              <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2 text-[0.8rem]">{getStationName(item.station)}</td>
                                <td className="border border-gray-300 px-4 py-2 text-[0.8rem]">{item.distance} (Km)</td>
                                <td className="border border-gray-300 px-4 py-2 text-[0.8rem]">{item.duration} (H)</td>
                                <td className="border border-gray-300 px-4 py-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="my-1 text-[0.8rem] text-red-400 px-4 py-0 rounded"
                                    onClick={() => deleteBaseArret(index)}
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

          {/* <div className='col-span-3'>
                <Label>Durée (H)</Label>
                <Input
                  type="number"
                  placeholder="Durée"
                  name="duration"
                  value={parseFloat(stop.duration)}
                  onChange={handleStopArretChange}
                />
              </div>
              <div className='col-span-3'>
                <Label>Distance (Km)</Label>
                <Input
                  type="number"
                  placeholder="Distance"
                  name="distance"
                  value={parseFloat(stop.distance)}
                  onChange={handleStopArretChange}
                />
              </div>  */}

          <div className='flex justify-end mt-2'>
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

        </form>
      </ReusableDialogSteps>
    </div>
  );
}
