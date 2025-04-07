import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CalendarFold, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReusableSelect from "@/component/utilitie/ReusableSelect";
import AddHoraire from "./AddHoraire";
import HoraireComponent from "../../component/utilitie/HoraireComponent";
import { API_ROUTE } from "../../../config";
import { setBreadCrumbItemsAction } from "@/store/actions/appActions";
import { horaire_routes_items } from "@/routes/horaire/horaire_routes";
import { JOURS } from "../../../constants"
import MapHoraire from "../../component/utilitie/map/MapHoraire";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { Checkbox } from "../../components/ui/checkbox";
import { Skeleton } from "@mui/material";

const fetchHoraire = async (dayWeek) => {
  const url = dayWeek ? `${API_ROUTE}/timetables?dayOfWeek=${dayWeek}` : `${API_ROUTE}/timetables/company/67bc9002f682d26a7f7a9200`;
  const { data } = await axios.get(url);
  return data;
};

const fetchHoraires = async (trip) => {
  try {
    const { data } = await axios.get(`${API_ROUTE}/trips/${trip}`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des voyages :", error);
    throw new Error("Impossible de récupérer les données du voyage.");
  }
};

const fetchCountry = async (countryId) => {
  try {
    const { data } = await axios.get(`${API_ROUTE}/country/${countryId}`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du pays :", error);
    throw new Error("Impossible de récupérer les données du pays.");
  }
};


const createHoraire = async (values) => {
  console.log("SENDER--------------->>>", values);
  const response = await axios.post(
    `${API_ROUTE}/timetables`,
    values
  );
  return response.data;
};

export default function Horaire() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [dayWeek, setDayWeek] = useState("")
  const queryClient = useQueryClient();

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ["horaire", dayWeek],
    queryFn: () => fetchHoraire(dayWeek),
    enabled: true,
  });

  const horaire = responseData?.data?.content || [];
  const totalPages = Math.ceil(horaire.length / itemsPerPage);

  console.log("{{{{{{{{{{{{{{{{{{{{{{{{", horaire);


  // Obtenir les éléments de la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = horaire.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([horaire_routes_items.horaire]));
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, []);

  const mutation = useMutation({
    mutationFn: createHoraire,
    onSuccess: () => {
      Swal.fire({
        title: "Succès!",
        text: "L'horaire a été enregistrée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { popup: "swal-custom" },
      });
      queryClient.invalidateQueries(["horaire"]);
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
    },
  });

  const formik = useFormik({
    initialValues: {
      company: "67bc9002f682d26a7f7a9200",
      trip: "",
      buses: [],
      departureDate: "",
      departureTime: "",
      isRecurring: false,
      recurringDays: [],
      recurrenceEnd: "",

      //////////////////
      bookingCutoff: "",
      exceptions: [],
      status: "",

      price: {
        country: "",
        amount: "",
        currency: {
          code: "",
          name: "",
          symbol: ""
        }
      },

      dayOfWeek: "",

      arrivalDay: "",
      arrivalTime: "",
      arrivalDate: "",
      notes: "",
    },
    onSubmit: async (values) => {
      console.log("Submitted values:", values);
      try {
        await mutation.mutateAsync(values);
      } catch (error) {
        console.error("Erreur lors de la soumission :", error);
      }
    },
  });

  const { values } = formik; // Récupération de values depuis formik

  const { data: tripCarto, isLoading: isLoadingCarto, error: errrorCarto } = useQuery({
    queryKey: ["trips", values.trip],
    queryFn: () => fetchHoraires(values.trip),
    enabled: !!values.trip,
  });

  const { data: countryData, isLoading: isLoadingCountry, error: errorCountry } = useQuery({
    queryKey: ["country", values.price.country],
    queryFn: () => fetchCountry(values.price.country),
    enabled: !!values.price.country, // Ne lance la requête que si country est défini
  });

  const DataCarto = tripCarto?.data
  console.log("country++++++++++++++++++++>>>>>>>>>>>>>>>>>>>>.", countryData);

  useEffect(() => {
    if (countryData?.currencies) {
      const [currencyCode, currencyInfo] = Object.entries(countryData.currencies)[0] || ["", {}];
      formik.setFieldValue("price.currency", {
        code: currencyCode || "",
        name: currencyInfo?.name || "",
        symbol: currencyInfo?.symbol || ""
      });
    }
  }, [countryData]);



  return (
    <div>
      <div className="grid grid-cols-12 gap-1">
        <div className="col-span-6 bg-white rounded-md">
          <div className="p-4">
            <AddHoraire formik={formik} countryData={countryData} mutation={mutation} />
            <div className="pt-2">
              <h1 className="text-sm font-medium">Listes d'horaire</h1>
              <hr className="my-2" />

              <div className="grid grid-cols-12 pt-2">
                <div className="col-span-6">
                  <div className="flex items-center gap-2">
                    <Filter className="text-[#191C21]" size="20" />
                    <ReusableSelect
                      options={JOURS}
                      placeholder="Filtrer par jour"
                      onChange={(value) => setDayWeek(value)}
                    />
                  </div>
                </div>
              </div>

              {currentItems.map((items) => (
                <div key={items?._id} className="mt-3">
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#191c2113] inline-block p-2 rounded-full">
                      <CalendarFold className="text-[#191c21bd]" size="17" />
                    </div>
                    <div>
                      <p className="text-[0.8rem] font-medium">{items?.dayOfWeek}</p>
                      <p className="text-[0.7rem] font-medium text-[#27272779]">
                        {items?.departureTime} départ
                      </p>
                    </div>
                  </div>
                  <HoraireComponent items={items} />
                </div>
              ))}


              <div className="mt-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  className="text-[0.7rem] px-6"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>

                <p className="text-sm font-medium">
                  Page {currentPage} / {totalPages}
                </p>

                <Button
                  variant="outline"
                  className="text-[0.7rem] px-6"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6 ">
          <div className="bg-white p-2">
            <MapHoraire DataCarto={DataCarto} />
            <div className="pt-3">



              <div className="border rounded-sm shadow p-2">
                <p className="text-[0.8rem] font-bold">Trajet</p>
                <hr className="my-2" />
                <div className="p-3 mt-2 overflow-auto">
                  <div className="p-0 space-y-2 text-[#000000a7]">

                    {DataCarto?.departureStation ? (
                      <p className="text-[0.7rem] font-semibold">
                        Départ station : {DataCarto.departureStation.name}
                      </p>
                    ) : (
                      <Skeleton className="h-4 w-36" />
                    )}

                    <p className="text-[0.8rem] font-medium">Stop :</p>
                    {DataCarto?.routes?.length > 0 ? (
                      DataCarto.routes.map((items, index) => (
                        <div
                          key={index}
                          className="px-2 py-3 rounded-lg shadow-sm hover:bg-[#00000009] transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox />
                            <label className="text-[0.8rem] font-medium leading-none">
                              {items?.station?.name}
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Skeleton lorsque les données ne sont pas disponibles
                      [...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="px-2 py-3 rounded-lg shadow-sm bg-[#f3f3f3] animate-pulse"
                        >
                          <div className="flex items-center space-x-2">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      ))
                    )}

                    {DataCarto?.arrivalStation ? (
                      <p className="text-[0.7rem] font-semibold">
                        Arrivée station : {DataCarto.arrivalStation.name}
                      </p>
                    ) : (
                      <Skeleton className="h-4 w-36" />
                    )}

                  </div>
                </div>
              </div>




            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
