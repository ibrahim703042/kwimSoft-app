import { useMemo } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/core/config/env";

interface Station {
  _id?: string;
  name?: string;
  locations?: { coordinates?: [number, number] };
}

interface MapDetailStationProps {
  Station?: Station[];
}

export default function MapDetailStation({ Station = [] }: Readonly<MapDetailStationProps>) {
  const token = env.mapboxToken;

  const center = useMemo(() => {
    const first = Station.find((s) => s.locations?.coordinates);
    if (first?.locations?.coordinates) {
      return {
        lat: first.locations.coordinates[1],
        lng: first.locations.coordinates[0],
      };
    }
    return { lat: 0, lng: 0 };
  }, [Station]);

  if (!token) {
    return (
      <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
        Configurez VITE_MAPBOX_TOKEN
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ latitude: center.lat, longitude: center.lng, zoom: center.lat ? 8 : 2 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {Station.map(
        (station) =>
          station.locations?.coordinates && (
            <Marker
              key={station._id ?? station.name}
              latitude={station.locations.coordinates[1]}
              longitude={station.locations.coordinates[0]}
            />
          )
      )}
    </Map>
  );
}
