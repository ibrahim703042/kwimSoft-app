import { useParams } from "react-router-dom";
import { API_ROUTE } from "../../../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import MapDetailTrip from "../../component/utilitie/map/MapDetailTrip";
import { Skeleton } from "@mui/material";
import { Checkbox } from "../../components/ui/checkbox";
import ChartMapcharts, { ChartMap } from "../../component/utilitie/ChartMapcharts";

const fetchTrip = async (id) => {
    const { data } = await axios.get(`${API_ROUTE}/trips/${id}`);
    return data;
};

export default function DetailTrip() {

    const { id } = useParams();
    const { data: trip, isLoading, error } = useQuery({
        queryKey: ["trip", id],
        queryFn: () => fetchTrip(id),
    });

    console.log("tripppppppppppDATATATATTA", trip?.data);
    const trips = trip?.data
    console.log("ppppppppppp", trips);
    console.log("gggggggggg", id);


    const tripData = {
        code: "TR123",
        departureStation: {
            name: "Paris",
            coordinates: [2.3522, 48.8566]
        },
        arrivalStation: {
            name: "Lyon",
            coordinates: [4.8357, 45.764],
        },
        distance: 465,
        basePrice: 50,
        currency: "EUR",
        bus: ["Mercedes Sprinter", "Volvo 9700"],
        company: "Voyage Express"
    };

    return (
        <div className="grid grid-cols-12">
            <div className="col-span-6 my-2 py-0 rounded-md">
                <div className="mt-0 mx-1 p-2">
                    <div>
                        <p className="font-semibold text-[0.8rem]">Station de départ</p>
                    </div>
                    <div className="border border-[#0f123f28] bg-white rounded-md p-2 px-4 mt-2">
                        <p className="font-semibold text-[0.8rem] text-[#00000055]">Order ID</p>
                        <p className="text-[0.8rem] font-semibold">{trips?.departureStation?._id}</p>
                        <div className="mt-2">
                            <p className="text-[0.8rem] font-medium mb-3">Designation  <span className="font-normal">{trips?.designation}</span></p>
                            <p className="text-[0.8rem] font-medium ">Station  <span className="font-normal">{trips?.departureStation?.state}</span></p>
                            <p className="text-[0.8rem] font-medium ">Pays <span className="font-normal">{trips?.departureStation?.country}</span></p>
                            <p className="text-[0.8rem] font-medium ">Ville  <span className="font-normal">{trips?.departureStation?.city}</span></p>
                        </div>
                    </div>
                </div>
                <div className=" mt-1 mx-1 p-2">
                    <div>
                        <p className="font-semibold text-[0.8rem]">Station d'arrivée</p>
                    </div>
                    <div className="border border-[#0f123f28] bg-white rounded-md p-2 px-4 mt-2">
                        <p className="font-semibold text-[0.8rem] text-[#00000055]">Order ID</p>
                        <p className="text-[0.8rem] font-semibold">{trips?.arrivalStation?._id}</p>
                        <div className="mt-2">
                            <p className="text-[0.8rem] font-medium  mb-3">Designation  <span className="font-normal">{trips?.designation}</span></p>
                            <p className="text-[0.8rem] font-medium">Station  <span className="font-normal">{trips?.arrivalStation?.state}</span></p>
                            <p className="text-[0.8rem] font-medium">Pays <span className="font-normal">{trips?.arrivalStation?.country}</span></p>
                            <p className="text-[0.8rem] font-medium ">Ville  <span className="font-normal">{trips?.arrivalStation?.city}</span></p>
                        </div>
                    </div>
                </div>
                <div className="mx-3">
                    <div className="border rounded-sm shadow p-2 bg-white">
                        <p className="text-[0.8rem] font-bold">Point d'arret</p>
                        <hr className="my-2" />
                        <div className="p-3 mt-0 overflow-auto">
                            <div className="p-0 space-y-2 text-[#000000a7]">
                                <p className="text-[0.8rem] font-medium">Stop :</p>
                                {trips?.routes?.length > 0 ? (
                                    trips.routes.map((items, index) => (
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-6 mb-5">
                <div className="mt-3 mr-2">
                    <MapDetailTrip trips={trips} />
                </div>
                <div className="mt-2 mr-2 bg-white pt-8">
                    <ChartMapcharts />
                </div>
            </div>
        </div>
    );
}
