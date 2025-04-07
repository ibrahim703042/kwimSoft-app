import axios from "axios";
import { API_ROUTE } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "../../components/ui/checkbox";
import { Search } from "lucide-react";
import { useState } from "react";
import MapDetailStation from "../../component/utilitie/map/MapDetailStation";

const fetchStation = async () => {
    const { data } = await axios.get(`${API_ROUTE}/stations/no-pagination/company/67bc9002f682d26a7f7a9200`);
    return data;
};

export default function GareMap() {
    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["statations"],
        queryFn: fetchStation,
    });

    const Station = responseData?.data || [];
    const [selectedStation, setSelectedStation] = useState(null);

    console.log("STATATION::::::::::",Station);
    

    // Fonction pour centrer la carte et ouvrir le modal
    const handleStationClick = (station) => {
        setSelectedStation(station);
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            <div className="col-span-8 h-full">
                <MapDetailStation Station={Station}/>
            </div>
            <div className="col-span-4 bg-white">
                <div className="md:col-span-4 text-[#272727] bg-[#ffffff]">
                    <div className="px-3 py-2">
                        <h3 className="text-[0.7rem] font-bold">Station</h3>
                    </div>
                    <hr />

                    {/* Barre de recherche */}
                    <div className="px-3 pt-3">
                        <div className="border-[1px] flex items-center justify-between rounded-xl px-3 py-1">
                            <input
                                type="text"
                                placeholder="Station"
                                className="text-[0.8rem] font-light"
                            />
                            <Search className="text-[#5a5a5a]" size={14} />
                        </div>
                    </div>

                    {/* Liste des trajets */}
                    <div className="p-4 mt-2 max-h-60 overflow-auto">
                        <div className="p-0 space-y-2 text-[#000000a7]">
                            {Station.map((station, index) => (
                                <div
                                    key={index}
                                    className="px-2 py-[5px] rounded-lg shadow-sm hover:bg-[#00000009] transition-colors cursor-pointer"
                                    onClick={() => handleStationClick(station)} // Ajoute cet onClick
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id={`station-${index}`} />
                                        <label className="text-[0.8rem] font-medium leading-none py-1">
                                            {station?.state}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
