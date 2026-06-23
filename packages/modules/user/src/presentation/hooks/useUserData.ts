import { useAuthStore } from "@kwim/auth";

/** Lightweight hook replacing admin useUserData for legacy user pages */
export function useUserData() {
  const { user } = useAuthStore();
  return {
    data: user,
    isLoading: false,
  };
}
