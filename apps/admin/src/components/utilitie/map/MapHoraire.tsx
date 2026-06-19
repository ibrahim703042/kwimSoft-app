import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Polyline } from "@react-google-maps/api";
import { MAP_KEYS } from "@kwim/config";
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

interface DataCartoType {
  departureStation?: StationPoint;
  arrivalStation?: StationPoint;
  routes?: RoutePoint[];
}

interface MapHoraireProps {
  readonly DataCarto?: DataCartoType;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.3731,
  lng: 29.9189,
};

function MapHoraire({ DataCarto }: Readonly<MapHoraireProps>) {
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [polylinePath, setPolylinePath] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    if (!DataCarto?.departureStation?.locations?.coordinates || !DataCarto?.arrivalStation?.locations?.coordinates) return;

    const departureCoords = {
      lat: DataCarto.departureStation.locations.coordinates[1],
      lng: DataCarto.departureStation.locations.coordinates[0],
    };

    const arrivalCoords = {
      lat: DataCarto.arrivalStation.locations.coordinates[1],
      lng: DataCarto.arrivalStation.locations.coordinates[0],
    };

    const waypoints =
      DataCarto.routes?.flatMap((route: RoutePoint) => {
        const coords = route.station?.locations?.coordinates;
        if (!coords || coords.length < 2) return [];
        return [{
          location: { lat: coords[1], lng: coords[0] },
          stopover: false,
        }];
      }) ?? [];

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: departureCoords,
        destination: arrivalCoords,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          const firstRoute = result.routes[0];
          if (firstRoute?.overview_path) {
            const path = firstRoute.overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }));
            setPolylinePath(path);
          }
        } else {
          console.error("Erreur Directions API :", status);
        }
      }
    );
  }, [DataCarto]);

  return (
    <LoadScript googleMapsApiKey={MAP_KEYS.googleMaps}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
        {/* Marqueur départ */}
        {(() => {
          const coords = DataCarto?.departureStation?.locations?.coordinates;
          if (!coords || coords.length < 2) return null;
          return (
          <Marker
            position={{ lat: coords[1], lng: coords[0] }}
            icon={{
              url: departedImg,
              scaledSize: new google.maps.Size(40, 32),
            }}
          />
          );
        })()}

        {(() => {
          const coords = DataCarto?.arrivalStation?.locations?.coordinates;
          if (!coords || coords.length < 2) return null;
          return (
          <Marker
            position={{ lat: coords[1], lng: coords[0] }}
            icon={{
              url: arrivalImg,
              scaledSize: new google.maps.Size(40, 32),
            }}
          />
          );
        })()}

        {DataCarto?.routes?.map((route: RoutePoint, index: number) => {
          const coords = route.station?.locations?.coordinates;
          if (!coords?.length) return null;
          return (
          <Marker
            key={`horaire-stop-${coords[0]}-${coords[1]}-${index}`}
            position={{ lat: coords[1], lng: coords[0] }}
            icon={{
              url: stopImg,
              scaledSize: new google.maps.Size(40, 32),
            }}
          />
          );
        })}

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
