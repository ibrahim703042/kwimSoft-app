export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tenantId?: string;
  tenantCode?: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
  isEmailVerified?: boolean;
  status?: string;
  accessToken: string;
  refreshToken: string;
  entrepriseId?: string;
  etablissementId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
}

export interface AuthActions {
  setUser: (user: User) => void;
  logout: () => void;
  setPermissions: (permissions: string[]) => void;
}

export type AuthStore = AuthState & AuthActions;
