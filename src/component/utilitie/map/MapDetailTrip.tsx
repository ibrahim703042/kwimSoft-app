import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import departedImg from "../../../assets/img/img/departed.png";
import arrivalImg from "../../../assets/img/img/arrival.png";
import stopImg from "../../../assets/img/img/stop.png";

const containerStyle = {
    width: "100%",
    height: "350px",
};

const center = {
    lat: -3.3731,
    lng: 29.9189,
};

const MapDetailTrip = ({ trips }) => {
    const [directions, setDirections] = useState(null);
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
            const departure = {
                lat: trips.departureStation.locations.coordinates[1],
                lng: trips.departureStation.locations.coordinates[0],
            };

            const arrival = {
                lat: trips.arrivalStation.locations.coordinates[1],
                lng: trips.arrivalStation.locations.coordinates[0],
            };

            const waypoints = trips.routes?.map(route => ({
                location: {
                    lat: route.station.locations.coordinates[1],
                    lng: route.station.locations.coordinates[0],
                },
                stopover: true,
            })) || [];

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
                {isGoogleLoaded && trips?.departureStation && (
                    <Marker
                        position={{
                            lat: trips.departureStation.locations.coordinates[1],
                            lng: trips.departureStation.locations.coordinates[0],
                        }}
                        icon={{
                            url: departedImg,
                            scaledSize: new window.google.maps.Size(40, 32),
                        }}
                    />
                )}

                {isGoogleLoaded && trips?.arrivalStation && (
                    <Marker
                        position={{
                            lat: trips.arrivalStation.locations.coordinates[1],
                            lng: trips.arrivalStation.locations.coordinates[0],
                        }}
                        icon={{
                            url: arrivalImg,
                            scaledSize: new window.google.maps.Size(40, 32),
                        }}
                    />
                )}

                {isGoogleLoaded &&
                    trips?.routes?.map((route, index) => (
                        <Marker
                            key={index}
                            position={{
                                lat: route.station.locations.coordinates[1],
                                lng: route.station.locations.coordinates[0],
                            }}
                            icon={{
                                url: stopImg,
                                scaledSize: new window.google.maps.Size(40, 32),
                            }}
                        />
                    ))}

                {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapDetailTrip;
