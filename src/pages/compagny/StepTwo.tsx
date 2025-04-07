import { useState } from "react";
import MapComponent from "../../component/cartoTrip/MapComponent";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import axios from "axios";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A";

export default function StepTwo({ formik, handleModalOpen }) {
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: formik.values.location?.latitude ?? -3.3792,
        longitude: formik.values.location?.longitude ?? 29.3640,
    });

    const handleMapClick = async (event) => {
        const { lng, lat } = event.lngLat;
        setSelectedLocation({ latitude: lat, longitude: lng });

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

            if (response.data.features.length > 0) {
                let country = "";
                let city = "";
                let region = "";
                let address = "";

                response.data.features.forEach((feature) => {
                    if (feature.place_type.includes("country")) {
                        country = feature.text;
                    }
                    if (feature.place_type.includes("place")) {
                        city = feature.text;
                        address = feature.place_name;
                    }
                    if (feature.context) {
                        feature.context.forEach((ctx) => {
                            if (ctx.id.includes("region")) {
                                region = ctx.text;
                            }
                        });
                    }
                });

                // 🔹 Mise à jour des champs dans Formik
                formik.setValues({
                    ...formik.values,
                    location: { latitude: lat, longitude: lng },
                    address: {
                        ...formik.values.address,
                        city: city || region,
                        street: address,
                    },
                    country,
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données de localisation :", error);
        }
    };

    return (
        <div>
            <h1 className="text-md font-medium mt-0">Adresse et localisation de la compagnie</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-12 space-x-3">
                <div className="col-span-12">
                    <MapComponent
                        latitude={selectedLocation.latitude}
                        longitude={selectedLocation.longitude}
                        onClick={handleMapClick}
                        height="150px"
                    />
                </div>
                <div className="col-span-6">
                    <Label htmlFor="address.complement" className="font-normal">
                        Complément d'adresse <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="address.complement"
                        value={formik.values.address.complement}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.address?.complement && formik.errors.address?.complement && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.address.complement}</p>
                    )}
                </div>
                <div className="col-span-6">
                    <Label htmlFor="address.street" className="font-normal">
                        Adresse <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="address.street"
                        value={formik.values.address.street}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled
                    />
                    {formik.touched.address?.street && formik.errors.address?.street && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.address.street}</p>
                    )}

                </div>
                <div className="col-span-6">
                    <Label htmlFor="country" className="font-normal">
                        Pays <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        disabled
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.country && formik.errors.country && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.country}</p>
                    )}
                </div>
                <div className="col-span-6">
                    <Label htmlFor="address.city" className="font-normal">
                        Région <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="address.city"
                        value={formik.values.address.city}
                        onChange={formik.handleChange}
                        disabled
                    />
                    {formik.touched.address?.city && formik.errors.address?.city && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.address.city}</p>
                    )}
                </div>
                <div className="col-span-4">
                    <Label htmlFor="address.postalCode" className="font-normal">
                        Code postal <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="*****"
                        className="mt-1"
                        name="address.postalCode"
                        value={formik.values.address.postalCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.address?.postalCode && formik.errors.address?.postalCode && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.address.postalCode}</p>
                    )}
                </div>
                <div className="col-span-4">
                    <Label htmlFor="location.latitude" className="font-normal">
                        Latitude
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="location.latitude"
                        value={formik.values.location.latitude}
                        onChange={formik.handleChange}
                        onClick={handleModalOpen}
                        disabled
                    />
                </div>
                <div className="col-span-4">
                    <Label htmlFor="location.longitude" className="font-normal">
                        Longitude
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="location.longitude"
                        value={formik.values.location.longitude}
                        onChange={formik.handleChange}
                        onClick={handleModalOpen}
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}
