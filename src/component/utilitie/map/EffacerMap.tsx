import { useState } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import pointerImg from "../../../assets/img/img/station.png"

const containerStyle = {
    width: "100%",
    height: "590px",
};


const center = {
    lat: -3.3731,
    lng: 29.9189,
};

const MapDetailTrip = ({ Station,trips }) => {
    const [map, setMap] = useState(null);
    const [searchBox, setSearchBox] = useState(null);

    console.log("MapGoogle DATA", trips);

    const onLoad = (autocomplete) => {
        setSearchBox(autocomplete);
    };

    const onPlaceChanged = () => {
        if (searchBox !== null) {
            const place = searchBox.getPlace();
            if (place && place.geometry) {
                const location = place.geometry.location;
                map.panTo(location);
                setTimeout(() => {
                    map.setZoom(14);
                }, 500);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyAsdwuTDFzqEddFBkP6q5Wj0aGY2cyUakI" libraries={["places"]}>
            <div style={{ position: "relative" }}>
                {/* Carte Google Maps */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={(map) => setMap(map)}
                >
                    {/* Affichage des marqueurs pour chaque station */}
                    {Station && Station.map((station, index) => (
                        station.locations.coordinates && station.locations.coordinates.length === 2 &&
                        !isNaN(station.locations.coordinates[0]) && !isNaN(station.locations.coordinates[1]) && (
                            <Marker
                                key={index}
                                position={{
                                    lat: station.locations.coordinates[1],
                                    lng: station.locations.coordinates[0],
                                }}
                                icon={
                                    window.google && window.google.maps
                                        ? {
                                            url: pointerImg,
                                            scaledSize: new window.google.maps.Size(40, 30),
                                        }
                                        : undefined
                                }
                                title={station.name}
                            />
                        )
                    ))}

                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default MapDetailTrip;



































































































































import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import departedImg from "../../../assets/img/img/departed.png";
import arrivalImg from "../../../assets/img/img/arrival.png";
import stopImg from "../../../assets/img/img/stop.png";

const containerStyle = {
    width: "100%",
    height: "590px",
}; 

const center = {
    lat: -3.3731,
    lng: 29.9189,
};

const MapDetailTrip = ({ trips }) => {
    const [directions, setDirections] = useState(null);

    useEffect(() => {
        if (
            trips?.departureStation && 
            trips?.arrivalStation && 
            window.google?.maps // Vérifie que Google Maps est chargé
        ) {
            const departure = {
                lat: trips.departureStation.locations.coordinates[1],
                lng: trips.departureStation.locations.coordinates[0]
            };

            const arrival = {
                lat: trips.arrivalStation.locations.coordinates[1],
                lng: trips.arrivalStation.locations.coordinates[0]
            };

            const waypoints = trips.routes?.map(route => ({
                location: {
                    lat: route.station.locations.coordinates[1],
                    lng: route.station.locations.coordinates[0]
                },
                stopover: true
            })) || [];

            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: departure,
                    destination: arrival,
                    waypoints,
                    travelMode: window.google.maps.TravelMode.DRIVING
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
    }, [trips]);

    return (
        <LoadScript googleMapsApiKey="AIzaSyAsdwuTDFzqEddFBkP6q5Wj0aGY2cyUakI" libraries={["places"]}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                {/* Vérifie si Google Maps est bien chargé avant d'utiliser Marker */}
                {window.google?.maps && trips?.departureStation && (
                    <Marker
                        position={{
                            lat: trips.departureStation.locations.coordinates[1],
                            lng: trips.departureStation.locations.coordinates[0]
                        }}
                        icon={{ 
                            url: departedImg, 
                            scaledSize: new window.google.maps.Size(40, 32) 
                        }}
                    />
                )}

                {window.google?.maps && trips?.arrivalStation && (
                    <Marker
                        position={{
                            lat: trips.arrivalStation.locations.coordinates[1],
                            lng: trips.arrivalStation.locations.coordinates[0]
                        }}
                        icon={{ 
                            url: arrivalImg, 
                            scaledSize: new window.google.maps.Size(40, 32)   
                        }}
                    />
                )}

                {window.google?.maps && trips?.routes?.map((route, index) => (
                    <Marker
                        key={index}
                        position={{
                            lat: route.station.locations.coordinates[1],
                            lng: route.station.locations.coordinates[0]
                        }}
                        icon={{ 
                            url: stopImg, 
                            scaledSize: new window.google.maps.Size(40, 32) 
                        }}
                    />
                ))}

                {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapDetailTrip;

