import type { User } from "./types";

const GUEST_USER_ID = "guest-kwim";

function base64UrlEncode(data: object): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function createGuestToken(sub: string): string {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlEncode({
    sub,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 365,
  });
  return `${header}.${payload}.guest-signature`;
}

/** Guest super-admin account for demo / development access */
export const GUEST_CREDENTIALS = {
  username: "kwim",
  email: "kwim@gmail.com",
  role: "Super Administrator",
} as const;

export function createGuestUser(): User {
  const accessToken = createGuestToken(GUEST_USER_ID);
  const refreshToken = createGuestToken(`${GUEST_USER_ID}-refresh`);

  return {
    id: GUEST_USER_ID,
    username: GUEST_CREDENTIALS.username,
    email: GUEST_CREDENTIALS.email,
    firstName: "Kwim",
    lastName: "Guest",
    roles: [GUEST_CREDENTIALS.role],
    permissions: [],
    isEmailVerified: true,
    status: "active_returning",
    accessToken,
    refreshToken,
  };
}

export function applyGuestLogin(setUser: (user: User) => void): User {
  localStorage.setItem("welcome_completed", "true");
  const user = createGuestUser();
  setUser(user);
  return user;
}
