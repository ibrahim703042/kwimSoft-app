import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { networkApi } from "./api";
import { notifyError, notifySuccess } from "@/lib/notify";

export function useStations() {
  return useQuery({
    queryKey: ["stations"],
    queryFn: () => networkApi.listStations(),
    staleTime: 5000,
  });
}

export function useDeleteStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => networkApi.deleteStation(id),
    onSuccess: () => {
      notifySuccess("Suppression effectuée avec succès.");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: () => notifyError("Une erreur est survenue. Veuillez réessayer."),
  });
}

export function useCreateStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: unknown) => networkApi.createStation(values),
    onSuccess: () => {
      notifySuccess("La station a été enregistrée avec succès.");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: () => notifyError("Une erreur est survenue. Veuillez réessayer."),
  });
}

export function useUpdateStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: unknown }) =>
      networkApi.updateStation(id, values),
    onSuccess: () => {
      notifySuccess("La station a été mise à jour avec succès.");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: () => notifyError("Une erreur est survenue. Veuillez réessayer."),
  });
}
