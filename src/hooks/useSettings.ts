// hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useGetAccountSettings = () =>
  useQuery(['accountSettings'], async () => {
    const { data } = await axios.get('/api/settings/account');
    return data;
  });

export const useUpdateAccountSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; email: string }) => {
      const { data } = await axios.put('/api/settings/account', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountSettings']);
    },
  });
};
