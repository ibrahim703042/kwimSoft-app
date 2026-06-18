import { DEFAULT_STATION_COMPANY_ID } from "@/core/config/tenantContext";
import { httpGet, httpPost, httpPatch, httpDelete } from "@/infrastructure/http/httpClient";

export const networkApi = {
  listStations: () =>
    httpGet(`/stations/no-pagination/company/${DEFAULT_STATION_COMPANY_ID}`),
  createStation: (values: unknown) => httpPost("/stations", values),
  updateStation: (id: string, values: unknown) => httpPatch(`/stations/${id}`, values),
  deleteStation: (id: string) => httpDelete(`/stations/${id}`),
};
