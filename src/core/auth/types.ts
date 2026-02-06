export interface User {
  tokenDecode: string | null;
  token: string;
  requiresPasswordReset: boolean;
  userID: string;
  permissions?: string[];
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
