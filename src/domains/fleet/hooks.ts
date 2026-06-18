import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fleetApi } from "@/domains/fleet/api";
import { notifyError, notifySuccess } from "@/lib/notify";

export function useDrivers(search = "") {
  return useQuery({
    queryKey: ["drivers", search],
    queryFn: () => fleetApi.listDrivers(search),
    staleTime: 5000,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: unknown) => fleetApi.createDriver(values),
    onSuccess: () => {
      notifySuccess("Le chauffeur a été enregistré avec succès.");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: () => notifyError("Une erreur est survenue. Veuillez réessayer."),
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: unknown }) =>
      fleetApi.updateDriver(id, values),
    onSuccess: () => {
      notifySuccess("Le chauffeur a été mis à jour avec succès.");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: () => notifyError("Une erreur est survenue. Veuillez réessayer."),
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["fleet-companies"],
    queryFn: () => fleetApi.listCompanies(),
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fleetApi.deleteDriver(id),
    onSuccess: () => {
      notifySuccess("Suppression effectuée avec succès.");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: () => notifyError("Une erreur est survenue. Veuillez réessayer."),
  });
}
