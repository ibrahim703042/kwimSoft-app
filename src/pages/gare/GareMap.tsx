import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { useState } from "react";
import MapDetailStation from "@/components/map/MapDetailStation";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import { useStations } from "@/domains/network/hooks";

export default function GareMap() {
  const { data: responseData, isLoading, isError, refetch } = useStations();
  const stations = responseData?.data ?? [];
  const [selectedStation, setSelectedStation] = useState<{ _id?: string; state?: string } | null>(null);

  if (isLoading) {
    return <LoadingState label="Chargement de la carte..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Impossible de charger les stations"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid h-screen grid-cols-12">
      <div className="col-span-8 h-full">
        <MapDetailStation Station={stations} />
      </div>
      <div className="col-span-4 bg-white">
        <div className="bg-[#ffffff] text-[#272727] md:col-span-4">
          <div className="px-3 py-2">
            <h3 className="text-[0.7rem] font-bold">Station</h3>
          </div>
          <hr />

          <div className="px-3 pt-3">
            <div className="flex items-center justify-between rounded-xl border px-3 py-1">
              <input
                type="text"
                placeholder="Station"
                className="text-[0.8rem] font-light"
                aria-label="Rechercher une station"
              />
              <Search className="text-[#5a5a5a]" size={14} />
            </div>
          </div>

          <div className="mt-2 max-h-60 overflow-auto p-4">
            <div className="space-y-2 p-0 text-[#000000a7]">
              {stations.map((station: { _id?: string; state?: string }) => (
                <button
                  key={station._id ?? station.state}
                  type="button"
                  className="w-full cursor-pointer rounded-lg px-2 py-[5px] text-left shadow-sm transition-colors hover:bg-[#00000009]"
                  onClick={() => setSelectedStation(station)}
                  aria-pressed={selectedStation?._id === station._id}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`station-${station._id}`} />
                    <span className="py-1 text-[0.8rem] font-medium leading-none">
                      {station?.state}
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
