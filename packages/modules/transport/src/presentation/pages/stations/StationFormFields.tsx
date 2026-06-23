import type { FormikErrors, FormikProps } from "formik";
import { Label, Input } from "@kwim/shared-ui";
import type { StationFormValues } from "../../../domain/station.types";

interface StationFormFieldsProps {
  readonly formik: FormikProps<StationFormValues>;
}

function getCoordinateError(
  errors: FormikErrors<StationFormValues>,
  index: 0 | 1
): string | undefined {
  const coordinates = errors.locations?.coordinates;
  if (!coordinates || typeof coordinates === "string") return undefined;
  return coordinates[index];
}

export function StationFormFields({ formik }: StationFormFieldsProps) {
  const longitudeError = getCoordinateError(formik.errors, 0);
  const latitudeError = getCoordinateError(formik.errors, 1);
  const coordinatesTouched = formik.touched.locations?.coordinates;

  const setCoordinate = (index: 0 | 1, value: string) => {
    const coords: [number, number] = [...formik.values.locations.coordinates];
    coords[index] = Number(value);
    formik.setFieldValue("locations.coordinates", coords);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <Label>Pays <span className="text-destructive text-[0.7rem]">*</span></Label>
        <Input name="country" value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.country && formik.errors.country && (
          <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.country}</p>
        )}
      </div>
      <div className="col-span-6">
        <Label>Région</Label>
        <Input name="city" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
      </div>
      <div className="col-span-6">
        <Label>Longitude <span className="text-destructive text-[0.7rem]">*</span></Label>
        <Input type="number" value={formik.values.locations.coordinates[0]} onChange={(e) => setCoordinate(0, e.target.value)} />
        {coordinatesTouched && longitudeError && <p className="text-destructive text-[0.7rem] mt-1">{longitudeError}</p>}
      </div>
      <div className="col-span-6">
        <Label>Latitude <span className="text-destructive text-[0.7rem]">*</span></Label>
        <Input type="number" value={formik.values.locations.coordinates[1]} onChange={(e) => setCoordinate(1, e.target.value)} />
        {coordinatesTouched && latitudeError && <p className="text-destructive text-[0.7rem] mt-1">{latitudeError}</p>}
      </div>
      <div className="col-span-4">
        <Label>Gare <span className="text-destructive text-[0.7rem]">*</span></Label>
        <Input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.name && formik.errors.name && <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.name}</p>}
      </div>
      <div className="col-span-4">
        <Label>Station <span className="text-destructive text-[0.7rem]">*</span></Label>
        <Input name="state" value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.state && formik.errors.state && <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.state}</p>}
      </div>
      <div className="col-span-4">
        <Label>Code Trajet <span className="text-destructive text-[0.7rem]">*</span></Label>
        <Input name="postalCode" value={formik.values.postalCode} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.postalCode && formik.errors.postalCode && <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.postalCode}</p>}
      </div>
      <div className="col-span-12">
        <Label>Adresse</Label>
        <Input name="address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.address && formik.errors.address && <p className="text-destructive text-[0.7rem] mt-1">{formik.errors.address}</p>}
      </div>
    </div>
  );
}
