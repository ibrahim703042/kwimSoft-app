import { Label } from "@/components/ui/label";
import { JOURS, TimeTableStatus } from "@/constants/constants";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import { Plus } from "lucide-react";
import LoadingState from "@/components/shared/LoadingState";
import { useBuses, useCountryDropdown, useTrips } from "@/domains/scheduling/hooks";

export default function AddHoraire({ formik, countryData, mutation }) {
  const { data: responseData } = useBuses();
  const { data: responseCountry } = useCountryDropdown();
  const { data: responseDataTrip } = useTrips();

  const bus = responseData?.data?.content || [];
  const trip = responseDataTrip?.data || [];
  const country = responseCountry?.data || [];
  console.log("country????????", country);


  const toggleSelection = (value) => {
    formik.setFieldValue(
      "recurringDays",
      formik.values.recurringDays.includes(value)
        ? formik.values.recurringDays.filter((v) => v !== value)
        : [...formik.values.recurringDays, value]
    );
  };

  const toggleSelections = (id) => {
    const newBusSelection = formik.values.buses.includes(id)
      ? formik.values.buses.filter(busId => busId !== id)
      : [...formik.values.buses, id];

    formik.setFieldValue("buses", newBusSelection);
  };

  const { values } = formik
  console.log("INITIAL VALUES", values);

  const jours = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <Label htmlFor="terms" className="font-normal"> Trip </Label>
            <Select onValueChange={(value) => formik.setFieldValue("trip", value)}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Sélectionner trajet" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {trip.map((tripItem) => (
                    <SelectItem key={tripItem._id} value={tripItem._id}>
                      {tripItem.designation}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.company && formik.errors.company && (
              <p className="text-red-500 mt-1 text-[0.7rem]">{formik.errors.company}</p>
            )}
          </div>

          <div className="col-span-6">
            <Label htmlFor="terms" className="font-normal">Bus</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {formik.values.buses.length > 0 ? bus.filter(b => formik.values.buses.includes(b._id)).map(b => b.modele).join(", ") : "Sélectionnez..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-full">
                {bus.map((option) => (
                  <button
                    key={option._id}
                    type="button"
                    className="flex w-full items-center gap-2 cursor-pointer px-2 hover:bg-gray-100 rounded text-left"
                    onClick={() => toggleSelections(option._id)}
                  >
                    <Checkbox
                      checked={formik.values.buses.includes(option._id)}
                    />
                    {option.modele}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>


          <div className="col-span-12 pt-1">
            <div className="col-span-12 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formik.values.isRecurring}
                  onCheckedChange={(checked) => {
                    formik.setFieldValue('isRecurring', checked);
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Récurrents
                </label>
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-3">
            <div className="flex justify-between">

              {formik.values.isRecurring === false &&
                <div className="flex items-center gap-2">
                  <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">Date départ</Label>
                    <Input
                      type="date"
                      placeholder="Date départ"
                      className="mt-1"
                      name="departureDate"
                      value={formik.values.departureDate ? new Date(formik.values.departureDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        const isoDate = new Date(dateValue).toISOString();
                        const dayOfWeek = jours[new Date(dateValue).getDay()];;
                        formik.setFieldValue('departureDate', isoDate);
                        formik.setFieldValue('dayOfWeek', dayOfWeek);
                      }}
                    />
                  </div>
                  <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">Date arrivée</Label>
                    <Input
                      type="date"
                      placeholder="Date arrivée"
                      className="mt-1"
                      name="arrivalDate"
                      value={formik.values.arrivalDate ? new Date(formik.values.arrivalDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        const isoDate = new Date(dateValue).toISOString();
                        const arrivalDay = jours[new Date(dateValue).getDay()];
                        formik.setFieldValue('arrivalDate', isoDate);
                        formik.setFieldValue('arrivalDay', arrivalDay);
                      }}
                    />
                  </div>
                </div>
              }

              <div className="flex items-center gap-2">
                <div className="col-span-6">
                  <Label htmlFor="terms" className="font-normal">Heure départ</Label>
                  <Input
                    type="time"
                    placeholder="Départ"
                    className="mt-1"
                    name="departureTime"
                    value={formik.values.departureTime}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="col-span-6">
                  <Label htmlFor="terms" className="font-normal">Heure Arrivée</Label>
                  <Input
                    type="time"
                    placeholder="Arrivée"
                    className="mt-1"
                    name="arrivalTime"
                    value={formik.values.arrivalTime}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </div>


            <div className="grid grid-cols-12 mt-2 gap-2">
              <div className='col-span-6'>
                <Label htmlFor="terms" className="font-normal">Pays  <span className="text-red-500 text-[0.7rem]">*</span></Label>
                <Select onValueChange={(value) => formik.setFieldValue("price.country", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {country.map((driverItem: any) => (
                        <SelectItem key={driverItem._id} value={driverItem._id}>
                          {`${driverItem?.name?.common}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-6">
                <Label htmlFor="terms" className="font-normal">Prix en <span className="text-[0.8rem]">( {countryData?.currencies?.BIF?.symbol} )</span> </Label>
                <Input
                  type="number"
                  name="price.amount"
                  placeholder=""
                  value={formik.values.price.amount}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-span-6">
                <Label htmlFor="terms" className="font-normal">Temps limite de réservation (en minutes)</Label>
                <Input
                  type="number"
                  name="bookingCutoff"
                  placeholder=""
                  value={formik.values.bookingCutoff}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-span-3">
                <div className="mt-0">
                  <Label htmlFor="terms" className="font-normal">
                    Status
                  </Label>
                </div>
                <Select onValueChange={(value) => formik.setFieldValue("status", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TimeTableStatus.map((compagnieItem) => (
                        <SelectItem key={compagnieItem.value} value={compagnieItem.value}>
                          {compagnieItem.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>


          </div>

          <div className="col-span-12 mt-5">
            <div className="flex w-full items-center">
              {/* Paragraphe */}
              <div className="block mr-1">
                <p className="text-[0.7rem] font-medium whitespace-nowrap">
                  AUTRES INFOS
                </p>
              </div>

              {/* Ligne noire */}
              <div className="flex-1">
                <div className="bg-[#00000010] h-[1px] w-full"></div>
              </div>
            </div>
          </div>

          {formik.values.isRecurring === true && <> <div className="col-span-6 mt-2">
            <Label className="block text-sm font-medium">jours récurrents</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {formik.values.recurringDays.length > 0
                    ? JOURS.filter(j => formik.values.recurringDays.includes(j.value))
                      .map(j => j.label)
                      .join(", ")
                    : "Sélectionnez..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-full">
                {JOURS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="flex w-full items-center gap-2 cursor-pointer px-2 hover:bg-gray-100 rounded text-left"
                    onClick={() => toggleSelection(option.value)}
                  >
                    <Checkbox checked={formik.values.recurringDays.includes(option.value)} />
                    {option.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

            <div className="col-span-6">
              <Label>Date de fin de récurrence</Label>
              <Input
                type="date"
                placeholder="Date de fin de récurrence"
                className="mt-1"
                name="recurrenceEnd"
                value={formik.values.recurrenceEnd ? new Date(formik.values.recurrenceEnd).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const dateValue = e.target.value;
                  const isoDate = new Date(dateValue).toISOString();
                  formik.setFieldValue('recurrenceEnd', isoDate);
                }}
              />
            </div>

            <div className="col-span-6">
              <Label htmlFor="terms" className="font-normal">Date d'exception</Label>
              <Input
                type="date"
                name="exceptionDate"
                onChange={(e) => {
                  const newDate = e.target.value;
                  if (newDate && !formik.values.exceptions.includes(newDate)) {
                    formik.setFieldValue("exceptions", [...formik.values.exceptions, newDate]);
                  }
                }}
              />

              {/* Liste des dates sélectionnées */}

            </div>
            <ul className="col-span-12">
              <div className="flex items-center gap-1">
                {formik.values.exceptions.map((date) => (
                  <li key={date} className="flex items-center justify-between p-2 border rounded mt-1 text-[0.7rem]">
                    {date}
                    <button
                      type="button"
                      className="text-red-500 ml-2 text-[0.7rem]"
                      onClick={() => {
                        formik.setFieldValue(
                          "exceptions",
                          formik.values.exceptions.filter((d) => d !== date)
                        );
                      }}
                    >
                      Annuler
                    </button>
                  </li>
                ))}
              </div>
            </ul>
          </>}

          <div className="col-span-12">
            <Label>Note</Label>
            <Textarea
              type="text"
              name="notes"
              placeholder="Note"
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </div>

          <div className="col-span-12">
            <div className="flex justify-end">
              {/* <Button variant="outline" size="icon">
                <Plus />
              </Button> */}

              <Button variant="outline" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <LoadingState loading className="py-0" />
                  </div>
                ) : (
                  <Plus />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
