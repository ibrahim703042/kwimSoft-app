import { useEffect, useState } from "react";
import type { FormikProps } from "formik";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { MAP_KEYS } from "@/config";
import type { MapClickEvent, StationFormValues } from "./station.types";
import { DEFAULT_COORDINATES } from "./station.types";

mapboxgl.accessToken = MAP_KEYS.mapbox;

export function useStationMapForm(formik: FormikProps<StationFormValues>) {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: formik.values.locations.coordinates[1] ?? DEFAULT_COORDINATES[1],
    longitude: formik.values.locations.coordinates[0] ?? DEFAULT_COORDINATES[0],
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ latitude, longitude });
        void formik.setFieldValue("locations.coordinates", [longitude, latitude]);
      },
      (error) => {
        console.error("Erreur de géolocalisation :", error);
      }
    );
  }, []);

  const handleMapClick = async (event: MapClickEvent) => {
    const { lng, lat } = event.lngLat;
    setSelectedLocation({ latitude: lat, longitude: lng });
    void formik.setFieldValue("locations.coordinates", [lng, lat]);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            types: "place,region,country",
            language: "fr",
          },
        }
      );

      const features = response.data.features as Array<{
        place_type: string[];
        text: string;
        place_name: string;
        context?: Array<{ id: string; text: string }>;
      }>;

      if (features.length === 0) return;

      let country = "";
      let region = "";
      let address = "";

      for (const feature of features) {
        if (feature.place_type.includes("country")) {
          country = feature.text;
        }
        if (feature.place_type.includes("place")) {
          address = feature.place_name;
        }
        feature.context?.forEach((ctx) => {
          if (ctx.id.includes("region")) {
            region = ctx.text;
          }
        });
      }

      void formik.setFieldValue("country", country);
      void formik.setFieldValue("city", region);
      void formik.setFieldValue("address", address);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de localisation :", error);
    }
  };

  return { selectedLocation, handleMapClick };
}
