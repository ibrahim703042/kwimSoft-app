import { useState } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { MAP_KEYS } from "@kwim/config";
import pointerImg from "../../assets/img/img/pointer.png";

interface StationLocation {
  coordinates?: [number, number];
}

interface StationItem {
  name?: string;
  locations?: StationLocation;
}

interface MapComponentProps {
  readonly Station?: StationItem[];
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -3.3731,
  lng: 29.9189,
};

function MapComponent({ Station }: Readonly<MapComponentProps>) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox && map) {
      const place = searchBox.getPlace();
      if (place?.geometry?.location) {
        const location = place.geometry.location;
        map.panTo(location);
        setTimeout(() => map.setZoom(14), 500);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={MAP_KEYS.googleMaps} libraries={["places"]}>
      <div style={{ position: "relative" }}>
        {/* Barre de recherche */}
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Rechercher un lieu..."
              style={{
                width: "300px",
                height: "40px",
                padding: "10px",
                fontSize: "16px",
                color: "#000000",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none"
              }}
            />
          </Autocomplete>
        </div>

        {/* Carte Google Maps */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {/* Affichage des marqueurs pour chaque station */}
          {Station?.map((station: StationItem, index: number) =>
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
};

export default MapComponent;
