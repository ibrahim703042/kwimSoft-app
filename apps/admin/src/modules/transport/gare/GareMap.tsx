import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import MapDetailStation from "@/components/utilitie/map/MapDetailStation";
import { stationApi } from "@/modules/transport/api/transport.api";
import type { StationData } from "./station.types";

export default function GareMap() {
  const { data: responseData } = useQuery({
    queryKey: ["stations"],
    queryFn: () => stationApi.list(),
  });

  const stations: StationData[] = responseData?.data ?? [];

  const handleStationClick = (station: StationData) => {
    console.log("Station clicked:", station);
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-8 h-full">
        <MapDetailStation Station={stations} />
      </div>
      <div className="col-span-4 bg-white">
        <div className="md:col-span-4 text-[#272727] bg-[#ffffff]">
          <div className="px-3 py-2">
            <h3 className="text-[0.7rem] font-bold">Station</h3>
          </div>
          <hr />

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

          <div className="p-4 mt-2 max-h-60 overflow-auto">
            <div className="p-0 space-y-2 text-[#000000a7]">
              {stations.map((station) => (
                <button
                  key={station._id}
                  type="button"
                  className="w-full text-left px-2 py-[5px] rounded-lg shadow-sm hover:bg-[#00000009] transition-colors cursor-pointer"
                  onClick={() => handleStationClick(station)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`station-${station._id}`} />
                    <span className="text-[0.8rem] font-medium leading-none py-1">
                      {station.state}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
