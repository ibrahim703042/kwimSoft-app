import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MAP_KEYS } from "@kwim/config";

interface StationLocation {
  coordinates?: [number, number];
}

interface StationItem {
  name?: string;
  locations?: StationLocation;
}

interface MapDetailStationProps {
  readonly stations?: StationItem[];
}

const containerStyle: React.CSSProperties = { width: "100%", height: "590px" };
const defaultCenter = { lat: -3.3731, lng: 29.9189 };

export default function MapDetailStation({ stations = [] }: Readonly<MapDetailStationProps>) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  return (
    <LoadScript googleMapsApiKey={MAP_KEYS.googleMaps} libraries={["places"]}>
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={8} onLoad={setMap}>
        {stations.map((station, index) => {
          const coords = station.locations?.coordinates;
          if (!coords || coords.length < 2) return null;
          return (
            <Marker
              key={`${station.name ?? "station"}-${index}`}
              position={{ lat: coords[1], lng: coords[0] }}
              title={station.name}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
}
