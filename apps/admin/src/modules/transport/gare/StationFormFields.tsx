import type { FormikErrors, FormikProps } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MapComponent from "@/components/others/cartoTrip/MapComponent";
import type { StationFormValues } from "./station.types";

interface StationFormFieldsProps {
  readonly formik: FormikProps<StationFormValues>;
  readonly selectedLocation: { latitude: number; longitude: number };
  readonly onMapClick: (event: { lngLat: { lng: number; lat: number } }) => void;
  readonly mapHeight?: string;
}

function getCoordinateError(
  errors: FormikErrors<StationFormValues>,
  index: 0 | 1
): string | undefined {
  const coordinates = errors.locations?.coordinates;
  if (!coordinates || typeof coordinates === "string") return undefined;
  return coordinates[index];
}

export function StationFormFields({
  formik,
  selectedLocation,
  onMapClick,
  mapHeight = "200px",
}: StationFormFieldsProps) {
  const longitudeError = getCoordinateError(formik.errors, 0);
  const latitudeError = getCoordinateError(formik.errors, 1);
  const coordinatesTouched = formik.touched.locations?.coordinates;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <MapComponent
          latitude={selectedLocation.latitude}
          longitude={selectedLocation.longitude}
          height={mapHeight}
          onClick={onMapClick}
        />
      </div>

      <div className="col-span-6">
        <Label>
          Pays <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="text"
          name="country"
          placeholder="Pays"
          value={formik.values.country}
          onChange={formik.handleChange}
          readOnly
          disabled
        />
        {formik.touched.country && formik.errors.country && (
          <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.country}</p>
        )}
      </div>

      <div className="col-span-6">
        <Label>
          Région <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="text"
          name="city"
          placeholder="Ville"
          value={formik.values.city}
          onChange={formik.handleChange}
          readOnly
          disabled
        />
      </div>

      <div className="col-span-6">
        <Label>
          Longitude <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="number"
          placeholder="Longitude"
          value={formik.values.locations.coordinates[0]}
          readOnly
          className="cursor-pointer"
          disabled
        />
        {coordinatesTouched && longitudeError && (
          <p className="text-destructive text-[0.7rem] mt-1">{longitudeError}</p>
        )}
      </div>

      <div className="col-span-6">
        <Label>
          Latitude <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="number"
          placeholder="Latitude"
          value={formik.values.locations.coordinates[1]}
          readOnly
          className="cursor-pointer"
          disabled
        />
        {coordinatesTouched && latitudeError && (
          <p className="text-destructive text-[0.7rem] mt-1">{latitudeError}</p>
        )}
      </div>

      <div className="col-span-4">
        <Label>
          Gare <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="Nom"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.name}</p>
        )}
      </div>

      <div className="col-span-4">
        <Label>
          Station <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="text"
          name="state"
          placeholder="Station"
          value={formik.values.state}
          onChange={formik.handleChange}
        />
        {formik.touched.state && formik.errors.state && (
          <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.state}</p>
        )}
      </div>

      <div className="col-span-4">
        <Label>
          Code Trajet <span className="text-destructive text-[0.7rem]">*</span>
        </Label>
        <Input
          type="text"
          name="postalCode"
          placeholder="Code trajet"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
        />
        {formik.touched.postalCode && formik.errors.postalCode && (
          <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.postalCode}</p>
        )}
      </div>
    </div>
  );
}
