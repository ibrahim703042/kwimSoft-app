import Map, { NavigationControl, MapLayerMouseEvent } from 'react-map-gl';

const TOKEN = 'pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A';

interface MapTripProps {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    mapStyle?: string;
    showNavigation?: boolean;
    onClick?: (event: MapLayerMouseEvent) => void;
    children?: React.ReactNode;
}

export default function MapTrip({
    latitude = -3.3614,
    longitude = 29.3599,
    zoom = 12,
    mapStyle = 'mapbox://styles/mapbox/streets-v12',
    showNavigation = true,
    onClick, 
    children
}: MapTripProps) {
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
