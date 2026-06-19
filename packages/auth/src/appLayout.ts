import type { User } from "./types";

export interface AppLayoutUser {
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

function roleField(obj: Record<string, unknown>, key: string): string | undefined {
  const val = obj[key];
  return typeof val === "string" ? val : undefined;
}

function normalizeRole(role: unknown): string {
  if (typeof role === "string") return role;
  if (role && typeof role === "object") {
    const obj = role as Record<string, unknown>;
    return roleField(obj, "name") ?? roleField(obj, "label") ?? roleField(obj, "code") ?? "User";
  }
  return "User";
}

/** Map auth user to AppLayout user config */
export function toAppLayoutUser(user: User | null): AppLayoutUser {
  if (!user) {
    return { fullName: "Guest", email: "", role: "User" };
  }

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username;

  return {
    fullName,
    email: user.email,
    role: user.roles?.length ? normalizeRole(user.roles[0]) : "User",
    avatar: user.avatar,
  };
}

/** Standard logout handler for satellite apps */
export function createAuthLogoutHandler(
  logout: () => void,
  loginPath = "/login"
): () => void {
  return () => {
    logout();
    globalThis.location.href = loginPath;
  };
}
