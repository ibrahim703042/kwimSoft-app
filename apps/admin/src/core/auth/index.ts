export {
  useAuthStore,
  useAuth,
  Can,
  useCan,
  ProtectedRoute,
  applyGuestLogin,
} from "@kwim/auth";
export type { User, AuthState, AuthActions, AuthStore } from "@kwim/auth";

// Auth pages (admin presentation layer)
export { default as Login } from "./login/Login";
export { default as ForgotPassword } from "./login/ForgotPassword";
export { default as UpdatePassword } from "./login/UpdatePassword";
export { default as Effacer } from "./login/Effacer";
