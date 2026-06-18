import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpGet, httpPut } from "@/infrastructure/http/httpClient";

export const useGetAccountSettings = () =>
  useQuery({
    queryKey: ["accountSettings"],
    queryFn: () => httpGet("/settings/account"),
  });

export const useUpdateAccountSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; email: string }) =>
      httpPut("/settings/account", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountSettings"] });
    },
  });
};
