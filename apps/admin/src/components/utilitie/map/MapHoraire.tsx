import { useEffect, useRef } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = "pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A";

interface Station {
  name?: string;
  locations?: {
    coordinates?: [number, number];
  };
}

interface Route {
  station?: Station;
}

interface MapHoraireProps {
  departureStation?: Station;
  arrivalStation?: Station;
  routes?: Route[];
}

export default function MapHoraire({ departureStation, arrivalStation, routes = [] }: MapHoraireProps) {
  const mapRef = useRef<any>(null);

  // Calculate center point between departure and arrival
  const getCenter = (): [number, number] => {
    if (departureStation?.locations?.coordinates && arrivalStation?.locations?.coordinates) {
      const [lng1, lat1] = departureStation.locations.coordinates;
      const [lng2, lat2] = arrivalStation.locations.coordinates;
      return [(lng1 + lng2) / 2, (lat1 + lat2) / 2];
    }
    if (departureStation?.locations?.coordinates) {
      return departureStation.locations.coordinates;
    }
    if (arrivalStation?.locations?.coordinates) {
      return arrivalStation.locations.coordinates;
    }
    return [0, 0];
  };

  // Create route line coordinates
  const getRouteCoordinates = () => {
    const coordinates: [number, number][] = [];
    
    if (departureStation?.locations?.coordinates) {
      coordinates.push(departureStation.locations.coordinates);
    }
    
    routes.forEach((route) => {
      if (route.station?.locations?.coordinates) {
        coordinates.push(route.station.locations.coordinates);
      }
    });
    
    if (arrivalStation?.locations?.coordinates) {
      coordinates.push(arrivalStation.locations.coordinates);
    }
    
    return coordinates;
  };

  const routeCoordinates = getRouteCoordinates();
  const center = getCenter();

  const routeGeoJSON = {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: routeCoordinates,
    },
  };

  const layerStyle = {
    id: "route",
    type: "line" as const,
    paint: {
      "line-color": "#3b82f6",
      "line-width": 4,
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={TOKEN}
      >
        {/* Departure Station Marker */}
        {departureStation?.locations?.coordinates && (
          <Marker
            longitude={departureStation.locations.coordinates[0]}
            latitude={departureStation.locations.coordinates[1]}
            color="green"
          />
        )}

        {/* Intermediate Route Markers */}
        {routes.map((route, index) => {
          if (route.station?.locations?.coordinates) {
            return (
              <Marker
                key={index}
                longitude={route.station.locations.coordinates[0]}
                latitude={route.station.locations.coordinates[1]}
                color="blue"
              />
            );
          }
          return null;
        })}

        {/* Arrival Station Marker */}
        {arrivalStation?.locations?.coordinates && (
          <Marker
            longitude={arrivalStation.locations.coordinates[0]}
            latitude={arrivalStation.locations.coordinates[1]}
            color="red"
          />
        )}

        {/* Route Line */}
        {routeCoordinates.length > 1 && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer {...layerStyle} />
          </Source>
        )}
      </Map>
    </div>
  );
}
