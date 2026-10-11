import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useHistoriqueSessions() {
  return useQuery({
    queryKey: ['historique', 'sessions'],
    queryFn: async () => (await api.get('/enseignant/historique')).data,
  });
}

export function useHistoriquePresences() {
  return useQuery({
    queryKey: ['historique', 'presences'],
    queryFn: async () => (await api.get('/enseignant/historique/presences')).data,
  });
}

export function useHistoriqueAbsences() {
  return useQuery({
    queryKey: ['historique', 'absences'],
    queryFn: async () => (await api.get('/enseignant/historique/absences')).data,
  });
}

export function useHistoriqueRetards() {
  return useQuery({
    queryKey: ['historique', 'retards'],
    queryFn: async () => (await api.get('/enseignant/historique/retards')).data,
  });
}
