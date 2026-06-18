import { DEFAULT_COMPANY_ID, DEFAULT_STATION_COMPANY_ID } from "@/core/config/tenantContext";
import { httpGet, httpPost } from "@/infrastructure/http/httpClient";

export const schedulingApi = {
  listTimetables: (dayWeek?: string) =>
    httpGet(
      dayWeek
        ? `/timetables?dayOfWeek=${dayWeek}`
        : `/timetables/company/${DEFAULT_COMPANY_ID}`
    ),
  createTimetable: (values: unknown) => httpPost("/timetables", values),
  getTrip: (tripId: string) => httpGet(`/trips/${tripId}`),
  getCountry: (countryId: string) => httpGet(`/country/${countryId}`),
  listBuses: () => httpGet("/buses"),
  listCompanies: () => httpGet("/companies"),
  listCountries: () => httpGet("/country/dropdown"),
  listTrips: () =>
    httpGet(`/trips/non-pagination/${DEFAULT_STATION_COMPANY_ID}`),
};
