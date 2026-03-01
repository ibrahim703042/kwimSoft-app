import * as React from "react";
import { useState } from "react";
import { useControl, Marker } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { IControl, MapInstance } from "react-map-gl/dist/esm/types";
interface GeocoderControlProps {
    mapboxAccessToken: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    marker?: boolean | React.ComponentProps<typeof Marker>;
    onLoading?: (event: any) => void;
    onResults?: (event: any) => void;
    onResult?: (event: any) => void;
    onError?: (event: any) => void;
    proximity?: [number, number];
    render?: (item: any) => string;
    language?: string;
    zoom?: number;
    flyTo?: boolean;
    placeholder?: string;
    countries?: string;
    types?: string;
    minLength?: number;
    limit?: number;
    filter?: (item: any) => boolean;
    origin?: string;
}

export default function GeocoderControl({
    mapboxAccessToken,
    position,
    marker = true,
    onLoading = () => { },
    onResults = () => { },
    onResult = () => { },
    onError = () => { },
    ...props
}: GeocoderControlProps) {
    const [markerElement, setMarkerElement] = useState<React.ReactNode>(null);

    const geocoder = useControl<MapboxGeocoder>(
        () => {
            const ctrl = new MapboxGeocoder({
                ...props,
                marker: false,
                accessToken: mapboxAccessToken,
                proximity: props.proximity
                    ? { lng: props.proximity[0], lat: props.proximity[1] }
                    : undefined, // Conversion correcte
            });

            ctrl.on("loading", onLoading);
            ctrl.on("results", onResults);
            ctrl.on("result", (evt) => {
                onResult(evt);

                const { result } = evt;
                const location =
                    result &&
                    (result.center ||
                        (result.geometry?.type === "Point" && result.geometry.coordinates));

                if (location && marker) {
                    setMarkerElement(
                        <Marker
                            {...(typeof marker === "object" ? marker : {})}
                            longitude={location[0]}
                            latitude={location[1]}
                        />
                    );
                } else {
                    setMarkerElement(null);
                }
            });

            ctrl.on("error", onError);
            return ctrl as unknown as IControl<MapInstance>; // Cast pour éviter l'erreur TypeScript
        },
        { position }
    );

    // Vérifier que `_map` existe avant d'appeler les setters
    if ((geocoder as any)._map) {
        if (props.proximity !== undefined) {
            geocoder.setProximity({ lng: props.proximity[0], lat: props.proximity[1] });
        }
        if (props.render !== undefined) {
            geocoder.setRenderFunction(props.render);
        }
        if (props.language !== undefined) {
            geocoder.setLanguage(props.language);
        }
        if (props.zoom !== undefined) {
            geocoder.setZoom(props.zoom);
        }
        if (props.flyTo !== undefined) {
            geocoder.setFlyTo(props.flyTo);
        }
        if (props.placeholder !== undefined) {
            geocoder.setPlaceholder(props.placeholder);
        }
        if (props.countries !== undefined) {
            geocoder.setCountries(props.countries);
        }
        if (props.types !== undefined) {
            geocoder.setTypes(props.types);
        }
        if (props.minLength !== undefined) {
            geocoder.setMinLength(props.minLength);
        }
        if (props.limit !== undefined) {
            geocoder.setLimit(props.limit);
        }
        if (props.filter !== undefined) {
            geocoder.setFilter(props.filter);
        }
        if (props.origin !== undefined) {
            geocoder.setOrigin(props.origin);
        }
    }

    return markerElement;
}
