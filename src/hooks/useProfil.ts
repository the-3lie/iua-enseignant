import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Enseignant } from '@/types';

export function useProfil() {
  return useQuery({
    queryKey: ['profil'],
    queryFn: async () => (await api.get<Enseignant>('/enseignant/profil')).data,
  });
}

export function useModifierProfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { firstName: string; lastName: string }) =>
      (await api.patch<Enseignant>('/enseignant/profil', dto)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profil'] }),
  });
}
