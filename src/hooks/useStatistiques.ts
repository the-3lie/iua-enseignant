import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { StatistiquesGlobales } from '@/types';

export function useStatistiquesGlobales() {
  return useQuery({
    queryKey: ['statistiques'],
    queryFn: async () => (await api.get<StatistiquesGlobales>('/enseignant/statistiques')).data,
  });
}

export function useStatistiquesClasses() {
  return useQuery({
    queryKey: ['statistiques', 'classes'],
    queryFn: async () => (await api.get('/enseignant/statistiques/classes')).data,
  });
}

export function useStatistiquesCours() {
  return useQuery({
    queryKey: ['statistiques', 'cours'],
    queryFn: async () => (await api.get('/enseignant/statistiques/cours')).data,
  });
}
