import { useQuery } from "@tanstack/react-query";
import { schedulingApi } from "./api";

export function useBuses() {
  return useQuery({
    queryKey: ["buses"],
    queryFn: () => schedulingApi.listBuses(),
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => schedulingApi.listCompanies(),
  });
}

export function useCountryDropdown() {
  return useQuery({
    queryKey: ["country-dropdown"],
    queryFn: () => schedulingApi.listCountries(),
  });
}

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: () => schedulingApi.listTrips(),
  });
}

export function useTimetables(dayWeek?: string) {
  return useQuery({
    queryKey: ["horaire", dayWeek ?? ""],
    queryFn: () => schedulingApi.listTimetables(dayWeek || undefined),
  });
}
