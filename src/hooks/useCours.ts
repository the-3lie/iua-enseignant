import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Classe, Etudiant, Matiere } from '@/types';

export function useCours() {
  return useQuery({
    queryKey: ['cours'],
    queryFn: async () => (await api.get<Matiere[]>('/enseignant/cours')).data,
  });
}

export function useCoursDetail(id?: string) {
  return useQuery({
    queryKey: ['cours', id],
    queryFn: async () => (await api.get<Matiere>(`/enseignant/cours/${id}`)).data,
    enabled: !!id,
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => (await api.get<Classe[]>('/enseignant/classes')).data,
  });
}

export function useEtudiantsClasse(classeId?: string) {
  return useQuery({
    queryKey: ['classes', classeId, 'etudiants'],
    queryFn: async () =>
      (await api.get<Etudiant[]>(`/enseignant/classes/${classeId}/etudiants`)).data,
    enabled: !!classeId,
  });
}
