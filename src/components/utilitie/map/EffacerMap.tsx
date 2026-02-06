import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import pointerImg from "../../../assets/img/img/station.png";

interface StationLocation {
  coordinates?: [number, number];
}

interface StationItem {
  name?: string;
  locations?: StationLocation;
}

interface MapDetailTripProps {
  Station?: StationItem[];
  trips?: unknown[];
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "590px",
};

const center = {
  lat: -3.3731,
  lng: 29.9189,
};

function MapDetailTrip({ Station }: MapDetailTripProps) {
  const [, setMap] = useState<google.maps.Map | null>(null);

    return (
        <LoadScript googleMapsApiKey="AIzaSyAsdwuTDFzqEddFBkP6q5Wj0aGY2cyUakI" libraries={["places"]}>
            <div style={{ position: "relative" }}>
                {/* Carte Google Maps */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={(mapInstance) => setMap(mapInstance)}
                >
                    {/* Affichage des marqueurs pour chaque station */}
                    {Station?.map((station, index) =>
                        station.locations?.coordinates?.length === 2 &&
                        !isNaN(station.locations.coordinates[0]) &&
                        !isNaN(station.locations.coordinates[1]) ? (
                            <Marker
                                key={index}
                                position={{
                                    lat: station.locations.coordinates[1],
                                    lng: station.locations.coordinates[0],
                                }}
                                icon={
                                    typeof window !== "undefined" && window.google?.maps
                                        ? {
                                            url: pointerImg,
                                            scaledSize: new window.google.maps.Size(40, 30),
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
};

export default MapDetailTrip;