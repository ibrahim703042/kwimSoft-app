import { useQuery } from "@tanstack/react-query";
import { Checkbox, Input } from "@kwim/shared-ui";
import { Search } from "lucide-react";
import { stationApi } from "../../../application/transport.api";
import type { StationData } from "../../../domain/station.types";
import MapDetailStation from "../../components/maps/MapDetailStation";

export default function StationsMapPage() {
  const { data: responseData } = useQuery({
    queryKey: ["stations"],
    queryFn: () => stationApi.list(),
  });

  const stations = (responseData?.data ?? []) as StationData[];

  return (
    <div className="grid grid-cols-12 min-h-[600px] bg-background border border-border rounded-xl overflow-hidden">
      <div className="col-span-8 h-full">
        <MapDetailStation stations={stations} />
      </div>
      <div className="col-span-4 bg-card border-l border-border h-full">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="text-xs font-bold text-foreground">Station</h3>
        </div>
        <div className="px-3 pt-3">
          <div className="flex items-center justify-between rounded-xl border border-input bg-background px-3 py-1.5">
            <Input type="text" placeholder="Station" className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" />
            <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          </div>
        </div>
        <div className="p-4 mt-2 max-h-60 overflow-auto space-y-2">
          {stations.map((station) => (
            <div key={station._id} className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-muted">
              <Checkbox id={`station-${station._id}`} />
              <span className="text-sm font-medium text-foreground">{station.state}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
