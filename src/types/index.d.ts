export interface KwimUser {
  tokenDecode: string | null;
  token: string;
  requiresPasswordReset: boolean;
  userID: string;
}

export interface ApiListResponse<T> {
  data?: {
    content?: T[];
    total?: number;
  };
}
