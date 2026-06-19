export const DEFAULT_COORDINATES = [29.364, -3.3792] as const;
export const STATION_COMPANY_ID = "67bc9002f682d26a7f7a9200";

export interface StationLocation {
  type: string;
  coordinates: number[];
}

export interface StationFormValues {
  name: string;
  state: string;
  country: string;
  city: string;
  address: string;
  postalCode?: string;
  company: string;
  locations: StationLocation;
}

export interface StationData extends StationFormValues {
  _id: string;
}

export interface MapClickEvent {
  lngLat: { lng: number; lat: number };
}
