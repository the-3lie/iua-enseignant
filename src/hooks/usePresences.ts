import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { SessionPresence, StatutPresence } from '@/types';

export function useSessionsActives() {
  return useQuery({
    queryKey: ['sessions-presence', 'actives'],
    queryFn: async () =>
      (await api.get<SessionPresence[]>('/enseignant/sessions-presence/actives')).data,
    refetchInterval: 15_000,
  });
}

export function useSession(id?: string) {
  return useQuery({
    queryKey: ['sessions-presence', id],
    queryFn: async () => (await api.get<SessionPresence>(`/enseignant/sessions-presence/${id}`)).data,
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.status === 'ACTIVE' ? 4_000 : false),
  });
}

export function useDemarrerSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { classId: string; subjectId: string; room: string; expectedCount: number }) =>
      (await api.post<SessionPresence>('/enseignant/sessions-presence', dto)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions-presence'] }),
  });
}

export function useClorerSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) =>
      (await api.patch<SessionPresence>(`/enseignant/sessions-presence/${sessionId}/cloturer`)).data,
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-presence'] });
      queryClient.invalidateQueries({ queryKey: ['sessions-presence', sessionId] });
    },
  });
}

export function useEnregistrerPresence(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { studentId: string; status: StatutPresence }) =>
      (await api.post('/enseignant/presences', { sessionId, ...dto })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions-presence', sessionId] }),
  });
}

export function useMarquerAbsence(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentId: string) =>
      (await api.post('/enseignant/presences/absence', { sessionId, studentId })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions-presence', sessionId] }),
  });
}

export function useMarquerRetard(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentId: string) =>
      (await api.post('/enseignant/presences/retard', { sessionId, studentId })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions-presence', sessionId] }),
  });
}

export function useModifierPresence(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ presenceId, status }: { presenceId: string; status: StatutPresence }) =>
      (await api.patch(`/enseignant/presences/${presenceId}`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions-presence', sessionId] }),
  });
}
