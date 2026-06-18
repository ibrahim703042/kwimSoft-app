import { useQuery } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import { identityApi } from "@/domains/identity/api";
import type { ConnectedUserProfile } from "@/domains/identity/types";
import { guestUserProfile, isGuestUser } from "@/core/auth/guestSession";

export const useUserData = () => {
  const { user } = useUserStore();
  const guest = isGuestUser(user);

  return useQuery<ConnectedUserProfile | null>({
    queryKey: ["user", guest ? "guest" : user?.tokenDecode],
    queryFn: () => {
      if (guest) return Promise.resolve(guestUserProfile);
      return user?.tokenDecode
        ? (identityApi.getConnectedUser(user.tokenDecode) as Promise<ConnectedUserProfile>)
        : Promise.resolve(null);
    },
    enabled: guest || Boolean(user?.tokenDecode),
  });
};