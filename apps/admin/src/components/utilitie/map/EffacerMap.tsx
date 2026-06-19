import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MAP_KEYS } from "@kwim/config";
import pointerImg from "../../../assets/img/img/station.png";

interface StationLocation {
  coordinates?: [number, number];
}

interface StationItem {
  name?: string;
  locations?: StationLocation;
}

interface MapDetailTripProps {
  readonly Station?: StationItem[];
  readonly trips?: unknown[];
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "590px",
};

const center = {
  lat: -3.3731,
  lng: 29.9189,
};

function MapDetailTrip({ Station }: Readonly<MapDetailTripProps>) {
  return (
    <LoadScript googleMapsApiKey={MAP_KEYS.googleMaps} libraries={["places"]}>
      <div style={{ position: "relative" }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {Station?.map((station, index) =>
            station.locations?.coordinates?.length === 2 &&
            !Number.isNaN(station.locations.coordinates[0]) &&
            !Number.isNaN(station.locations.coordinates[1]) ? (
              <Marker
                key={station.name ?? `station-marker-${index}`}
                position={{
                  lat: station.locations.coordinates[1],
                  lng: station.locations.coordinates[0],
                }}
                icon={
                  globalThis.window?.google?.maps
                    ? {
                        url: pointerImg,
                        scaledSize: new globalThis.window.google.maps.Size(40, 30),
                      }
                    : undefined
                }
                title={station.name}
              />
            ) : null
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default MapDetailTrip;