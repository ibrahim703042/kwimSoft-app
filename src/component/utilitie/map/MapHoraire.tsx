import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Polyline } from "@react-google-maps/api";
import departedImg from "../../../assets/img/img/departed.png";
import arrivalImg from "../../../assets/img/img/arrival.png";
import stopImg from "../../../assets/img/img/stop.png";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Coordonnées par défaut (Burundi)
const center = {
  lat: -3.3731,
  lng: 29.9189,
};

const MapHoraire = ({ DataCarto }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [polylinePath, setPolylinePath] = useState([]); // Stocke la ligne simple

  useEffect(() => {
    if (DataCarto) {
      const departureCoords = {
        lat: DataCarto.departureStation.locations.coordinates[1],
        lng: DataCarto.departureStation.locations.coordinates[0],
      };

      const arrivalCoords = {
        lat: DataCarto.arrivalStation.locations.coordinates[1],
        lng: DataCarto.arrivalStation.locations.coordinates[0],
      };

      const waypoints = DataCarto?.routes?.map(route => ({
        location: {
          lat: route.station.locations.coordinates[1],
          lng: route.station.locations.coordinates[0],
        },
        stopover: false, // Pas d'arrêt, juste un passage
      }));

      if (departureCoords && arrivalCoords) {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: departureCoords,
            destination: arrivalCoords,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING, // Mode voiture
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              setDirectionsResponse(result);

              // Extraction de la ligne simple
              const path = result.routes[0].overview_path.map(point => ({
                lat: point.lat(),
                lng: point.lng(),
              }));
              setPolylinePath(path);
            } else {
              console.error("Erreur Directions API :", status);
            }
          }
        );
      }
    }
  }, [DataCarto]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAsdwuTDFzqEddFBkP6q5Wj0aGY2cyUakI">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
        {/* Marqueur départ */}
        {DataCarto?.departureStation && (
          <Marker
            position={{
              lat: DataCarto.departureStation.locations.coordinates[1],
              lng: DataCarto.departureStation.locations.coordinates[0],
            }}
            icon={{
              url: departedImg,
              scaledSize: new google.maps.Size(40, 32),
            }}
          />
        )}

        {/* Marqueur arrivée */}
        {DataCarto?.arrivalStation && (
          <Marker
            position={{
              lat: DataCarto.arrivalStation.locations.coordinates[1],
              lng: DataCarto.arrivalStation.locations.coordinates[0],
            }}
            icon={{
              url: arrivalImg,
              scaledSize: new google.maps.Size(40, 32),
            }}
          />
        )}

        {/* Marqueurs pour les stations intermédiaires */}
        {DataCarto?.routes?.map((route, index) => (
          <Marker
            key={index}
            position={{
              lat: route.station.locations.coordinates[1],
              lng: route.station.locations.coordinates[0],
            }}
            icon={{
              url: stopImg,
              scaledSize: new google.maps.Size(40, 32),
            }}
          />
        ))}

        {/* Affichage de l'itinéraire Google Maps avec suppression des marqueurs */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{ suppressMarkers: true }} // Empêche les marqueurs par défaut
          />
        )}

        {/* Ligne simple suivant l'itinéraire */}
        {polylinePath.length > 0 && (
          <Polyline
            path={polylinePath}
            options={{
              strokeColor: "#FF0000", // Rouge
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapHoraire;
