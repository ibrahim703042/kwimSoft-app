import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/core/config/env";

interface TripData {
  departureStation?: { name?: string; locations?: { coordinates?: number[] } };
  arrivalStation?: { name?: string; locations?: { coordinates?: number[] } };
  routes?: Array<{ station?: { locations?: { coordinates?: number[] } } }>;
}

interface MapHoraireProps {
  DataCarto?: TripData;
}

export default function MapHoraire({ DataCarto }: Readonly<MapHoraireProps>) {
  const token = env.mapboxToken;
  const departure = DataCarto?.departureStation?.locations?.coordinates;
  const lat = departure?.[1] ?? 0;
  const lng = departure?.[0] ?? 0;

  if (!token) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
        Carte non disponible
      </div>
    );
  }

  return (
    <div className="h-48 rounded-md overflow-hidden">
      <Map
        mapboxAccessToken={token}
        initialViewState={{ latitude: lat || 0, longitude: lng || 0, zoom: lat ? 10 : 2 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {departure && (
          <Marker latitude={departure[1]} longitude={departure[0]} color="green" />
        )}
        {DataCarto?.arrivalStation?.locations?.coordinates && (
          <Marker
            latitude={DataCarto.arrivalStation.locations.coordinates[1]}
            longitude={DataCarto.arrivalStation.locations.coordinates[0]}
            color="red"
          />
        )}
      </Map>
    </div>
  );
}
