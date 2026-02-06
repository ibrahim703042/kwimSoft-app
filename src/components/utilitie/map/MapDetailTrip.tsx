import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import departedImg from "../../../assets/img/img/departed.png";
import arrivalImg from "../../../assets/img/img/arrival.png";
import stopImg from "../../../assets/img/img/stop.png";

interface StationLocation {
  coordinates?: [number, number];
}

interface StationPoint {
  locations?: StationLocation;
}

interface RoutePoint {
  station: StationPoint;
}

interface MapDetailTripTrips {
  departureStation?: StationPoint;
  arrivalStation?: StationPoint;
  routes?: RoutePoint[];
}

interface MapDetailTripProps {
  trips?: MapDetailTripTrips;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "350px",
};

const center = {
  lat: -3.3731,
  lng: 29.9189,
};

function MapDetailTrip({ trips }: MapDetailTripProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

    useEffect(() => {
        if (window.google?.maps) {
            setIsGoogleLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (
            isGoogleLoaded &&
            trips?.departureStation &&
            trips?.arrivalStation
        ) {
            const depCoords = trips.departureStation?.locations?.coordinates;
            const arrCoords = trips.arrivalStation?.locations?.coordinates;
            if (!depCoords?.length || !arrCoords?.length) return;

            const departure = {
                lat: depCoords[1],
                lng: depCoords[0],
            };

            const arrival = {
                lat: arrCoords[1],
                lng: arrCoords[0],
            };

            const waypoints = (trips.routes?.map((route: RoutePoint) => {
                const coords = route.station?.locations?.coordinates;
                if (!coords?.length) return null;
                return {
                    location: { lat: coords[1], lng: coords[0] },
                    stopover: true,
                };
            }).filter(Boolean) ?? []) as { location: { lat: number; lng: number }; stopover: boolean }[];

            if (window.google?.maps?.DirectionsService) {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route(
                    {
                        origin: departure,
                        destination: arrival,
                        waypoints,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === window.google.maps.DirectionsStatus.OK) {
                            setDirections(result);
                        } else {
                            console.error("Erreur lors du calcul de l'itinéraire :", status);
                        }
                    }
                );
            }
        }
    }, [isGoogleLoaded, trips]);

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyAsdwuTDFzqEddFBkP6q5Wj0aGY2cyUakI"
            libraries={["places"]}
            onLoad={() => setIsGoogleLoaded(true)}
        >
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                {isGoogleLoaded && trips?.departureStation?.locations?.coordinates?.length === 2 && (
                    <Marker
                        position={{
                            lat: trips.departureStation.locations!.coordinates![1],
                            lng: trips.departureStation.locations!.coordinates![0],
                        }}
                        icon={{
                            url: departedImg,
                            scaledSize: new window.google.maps.Size(40, 32),
                        }}
                    />
                )}

                {isGoogleLoaded && trips?.arrivalStation?.locations?.coordinates?.length === 2 && (
                    <Marker
                        position={{
                            lat: trips.arrivalStation.locations!.coordinates![1],
                            lng: trips.arrivalStation.locations!.coordinates![0],
                        }}
                        icon={{
                            url: arrivalImg,
                            scaledSize: new window.google.maps.Size(40, 32),
                        }}
                    />
                )}

                {isGoogleLoaded &&
                    trips?.routes?.map((route: RoutePoint, index: number) => {
                        const coords = route.station?.locations?.coordinates;
                        if (!coords?.length) return null;
                        return (
                        <Marker
                            key={index}
                            position={{ lat: coords[1], lng: coords[0] }}
                            icon={{
                                url: stopImg,
                                scaledSize: new window.google.maps.Size(40, 32),
                            }}
                        />
                        );
                    })}

                {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapDetailTrip;
