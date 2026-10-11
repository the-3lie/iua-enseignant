import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Notification } from '@/types';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get<Notification[]>('/enseignant/notifications')).data,
  });
}

export function useCompteurNotifications() {
  return useQuery({
    queryKey: ['notifications', 'compteur'],
    queryFn: async () => (await api.get<{ count: number }>('/enseignant/notifications/compteur')).data,
    refetchInterval: 30_000,
  });
}

export function useMarquerNotificationLue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.patch(`/enseignant/notifications/${id}/lue`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarquerToutesLues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.patch('/enseignant/notifications/toutes-lues')).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
