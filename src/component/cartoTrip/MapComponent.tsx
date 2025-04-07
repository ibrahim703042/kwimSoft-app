import Map, {
    NavigationControl,
    GeolocateControl,
    Marker,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import GeocoderControl from "./GeocoderControl";

const TOKEN =
    "pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A";

export default function MapComponent({ latitude, longitude, onClick, height = '200px' }) {
    return (
        <div className={`w-full`} style={{ height }}>
            <Map
                initialViewState={{
                    latitude,
                    longitude,
                    zoom: 16,
                    pitch: 10,
                    bearing: 0,
                }}
                maxPitch={85}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={TOKEN}
                style={{ width: '100%', height: '100%' }}
                onClick={onClick}
            >
                <GeocoderControl mapboxAccessToken={TOKEN} position="top-right" />
                <NavigationControl position="top-right" visualizePitch={true} />
                <GeolocateControl position="top-right" />

                <Marker latitude={latitude} longitude={longitude} color="red" />
            </Map>
        </div>
    );
}
