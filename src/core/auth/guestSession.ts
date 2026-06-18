import type { User } from "@/store/useUserStore";
import type { ConnectedUserProfile } from "@/domains/identity/types";
import { DEFAULT_COMPANY_ID } from "@/core/config/tenantContext";

export const GUEST_TOKEN = "guest";
export const GUEST_USER_ID = "guest";

export function createGuestUser(): User {
  return {
    token: GUEST_TOKEN,
    tokenDecode: GUEST_USER_ID,
    requiresPasswordReset: false,
    userID: GUEST_USER_ID,
    isGuest: true,
  };
}

export function isGuestUser(
  user?: { token?: string; isGuest?: boolean } | null
): boolean {
  return Boolean(user?.isGuest) || user?.token === GUEST_TOKEN;
}

export const guestUserProfile: ConnectedUserProfile = {
  fullName: "Invité",
  email: "guest@demo.local",
  username: "guest",
  companyId: {
    keycloakGroupId: DEFAULT_COMPANY_ID,
    name: "Mode démo",
  },
};
