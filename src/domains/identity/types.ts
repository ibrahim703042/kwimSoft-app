export interface ConnectedUserProfile {
  fullName?: string;
  email?: string;
  username?: string;
  companyId?: {
    keycloakGroupId?: string;
    name?: string;
  };
}
