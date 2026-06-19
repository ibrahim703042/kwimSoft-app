import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
    <div className="grid grid-cols-12 h-screen bg-background">
      <div className="col-span-8 h-full">
        <MapDetailStation Station={stations} />
      </div>
      <div className="col-span-4 kwim-surface rounded-none border-l h-full">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="text-xs font-bold text-foreground">Station</h3>
        </div>

        <div className="px-3 pt-3">
          <div className="flex items-center justify-between rounded-xl border border-input bg-background px-3 py-1.5">
            <Input
              type="text"
              placeholder="Station"
              className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
            <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          </div>
        </div>

        <div className="p-4 mt-2 max-h-60 overflow-auto">
          <div className="space-y-2">
            {stations.map((station) => (
              <button
                key={station._id}
                type="button"
                className="w-full text-left px-2 py-1.5 rounded-lg border border-transparent hover:bg-muted transition-colors"
                onClick={() => handleStationClick(station)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox id={`station-${station._id}`} />
                  <span className="text-sm font-medium text-foreground">{station.state}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
