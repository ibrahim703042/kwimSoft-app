import { DEFAULT_COMPANY_ID } from "@/core/config/tenantContext";
import { httpGet, httpPost, httpPut, httpDelete } from "@/infrastructure/http/httpClient";

export const fleetApi = {
  listDrivers: (search?: string) =>
    httpGet(
      search
        ? `/drivers?search=${search}`
        : `/drivers?company=${DEFAULT_COMPANY_ID}`
    ),
  createDriver: (values: unknown) => httpPost("/drivers", values),
  updateDriver: (id: string, values: unknown) => httpPut(`/drivers/${id}`, values),
  deleteDriver: (id: string) => httpDelete(`/drivers/${id}`),
  getDriver: (id: string) => httpGet(`/drivers/${id}`),
  listCompanies: () => httpGet("/companies"),
};
