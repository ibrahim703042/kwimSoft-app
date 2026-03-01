import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = "pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A";

interface Station {
  _id: string;
  name?: string;
  state?: string;
  country?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface MapDetailStationProps {
  Station: Station[];
}

export default function MapDetailStation({ Station }: MapDetailStationProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [viewState, setViewState] = useState({
    longitude: Station[0]?.longitude || 0,
    latitude: Station[0]?.latitude || 0,
    zoom: 6,
  });

  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={TOKEN}
      >
        {/* Station Markers */}
        {Station.map((station) => {
          if (station.latitude && station.longitude) {
            return (
              <Marker
                key={station._id}
                longitude={station.longitude}
                latitude={station.latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedStation(station);
                }}
              >
                <div className="cursor-pointer">
                  <svg
                    height="30"
                    viewBox="0 0 24 24"
                    style={{
                      fill: "#3b82f6",
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  >
                    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                  </svg>
                </div>
              </Marker>
            );
          }
          return null;
        })}

        {/* Popup for selected station */}
        {selectedStation && selectedStation.latitude && selectedStation.longitude && (
          <Popup
            longitude={selectedStation.longitude}
            latitude={selectedStation.latitude}
            anchor="top"
            onClose={() => setSelectedStation(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2">
              <h3 className="font-bold text-sm">{selectedStation.name || selectedStation.state}</h3>
              {selectedStation.city && (
                <p className="text-xs text-gray-600">{selectedStation.city}</p>
              )}
              {selectedStation.address && (
                <p className="text-xs text-gray-500">{selectedStation.address}</p>
              )}
              {selectedStation.country && (
                <p className="text-xs text-gray-500">{selectedStation.country}</p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
