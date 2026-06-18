import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { identityApi } from "./api";
import httpClient from "@/infrastructure/http/httpClient";
import { notifyError, notifySuccess } from "@/lib/notify";
import { DEFAULT_COMPANY_ID } from "@/core/config/tenantContext";

export function useConnectedUser(id?: string | null) {
  return useQuery({
    queryKey: ["connected-user", id],
    queryFn: () => identityApi.getConnectedUser(id!),
    enabled: Boolean(id),
  });
}

export function useGroups(companyGroupId?: string) {
  return useQuery({
    queryKey: ["iam-groups", companyGroupId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/group/subgroup?groupId=${companyGroupId}`);
      return data;
    },
    enabled: Boolean(companyGroupId),
  });
}

export function useCreateGroup(companyGroupId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: { name: string }) =>
      httpClient.post(`/group/create-subgroup/${companyGroupId}`, values),
    onSuccess: () => {
      notifySuccess("Function created successfully.");
      queryClient.invalidateQueries({ queryKey: ["iam-groups"] });
    },
    onError: () => notifyError("Failed to create function."),
  });
}

export function useSubgroupMembers(subGroupId: string) {
  return useQuery({
    queryKey: ["iam-subgroup-members", subGroupId],
    queryFn: async () => {
      const { data } = await httpClient.get(
        `/group/subgroup-members?subGroupId=${subGroupId}`
      );
      return data;
    },
    enabled: Boolean(subGroupId),
  });
}

export function useAssignUserToGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      groupId,
    }: {
      userId: string;
      groupId: string;
    }) =>
      httpClient.patch(
        `/drivers/staff-account/${userId}?groupId=${groupId}`
      ),
    onSuccess: () => {
      notifySuccess("User assigned successfully.");
      queryClient.invalidateQueries({ queryKey: ["iam-users"] });
    },
    onError: () => notifyError("Failed to assign user."),
  });
}

export function useStaffDrivers() {
  return useQuery({
    queryKey: ["iam-staff-drivers"],
    queryFn: async () => {
      const { data } = await httpClient.get(`/drivers?company=${DEFAULT_COMPANY_ID}`);
      return data;
    },
  });
}
