import Map, { NavigationControl, type MapMouseEvent } from 'react-map-gl';
import { MAP_KEYS } from '@kwim/config';

const TOKEN = MAP_KEYS.mapbox;

interface MapTripProps {
  readonly latitude?: number;
  readonly longitude?: number;
  readonly zoom?: number;
  readonly mapStyle?: string;
  readonly showNavigation?: boolean;
  readonly onClick?: (event: MapMouseEvent) => void;
  readonly children?: React.ReactNode;
}

export default function MapTrip({
  latitude = -3.3614,
  longitude = 29.3599,
  zoom = 12,
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  showNavigation = true,
  onClick,
  children,
}: Readonly<MapTripProps>) {
  return (
    <div className="h-full w-full">
      <Map
        initialViewState={{ latitude, longitude, zoom }}
        mapboxAccessToken={TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        onClick={onClick}
      >
        {showNavigation && <NavigationControl position="top-right" />}
        {children}
      </Map>
    </div>
  );
}
