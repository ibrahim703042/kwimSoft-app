export const DEFAULT_COMPANY_ID = "67cfe955595f541695c1b99b";
export const DEFAULT_STATION_COMPANY_ID = "67bc9002f682d26a7f7a9200";

export function getCompanyIdFromUser(
  user?: {
    userID?: string;
    companyId?: { keycloakGroupId?: string };
  } | null
): string {
  return user?.companyId?.keycloakGroupId || user?.userID || DEFAULT_COMPANY_ID;
}

export function getStationCompanyId(): string {
  return DEFAULT_STATION_COMPANY_ID;
}
