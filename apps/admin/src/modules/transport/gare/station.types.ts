export const DEFAULT_COORDINATES = [29.364, -3.3792] as const;
export const STATION_COMPANY_ID = "67bc9002f682d26a7f7a9200";

export interface StationLocation {
  type: string;
  coordinates: [number, number];
}

export function normalizeCoordinates(coords?: number[]): [number, number] {
  if (coords && coords.length >= 2) {
    return [coords[0], coords[1]];
  }
  return [DEFAULT_COORDINATES[0], DEFAULT_COORDINATES[1]];
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
