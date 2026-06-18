import { useCallback, useRef } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/core/config/env";

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  height?: string;
  onClick?: (event: { lngLat: { lng: number; lat: number } }) => void;
}

export default function MapPicker({
  latitude = 0,
  longitude = 0,
  height = "200px",
  onClick,
}: Readonly<MapPickerProps>) {
  const mapRef = useRef<MapRef>(null);
  const token = env.mapboxToken;

  const handleClick = useCallback(
    (event: { lngLat: { lng: number; lat: number } }) => {
      onClick?.(event);
    },
    [onClick]
  );

  if (!token) {
    return (
      <div
        className="flex items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground"
        style={{ height }}
      >
        Configurez VITE_MAPBOX_TOKEN pour afficher la carte
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden" style={{ height }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{
          latitude: latitude || 0,
          longitude: longitude || 0,
          zoom: latitude ? 12 : 2,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={handleClick}
      >
        {latitude !== 0 && longitude !== 0 && (
          <Marker latitude={latitude} longitude={longitude} />
        )}
      </Map>
    </div>
  );
}
