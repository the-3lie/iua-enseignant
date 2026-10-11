import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreneauEmploiDuTemps } from '@/types';

export function useEmploiDuTemps(params?: { jour?: number }) {
  return useQuery({
    queryKey: ['emploi-du-temps', params?.jour],
    queryFn: async () => {
      const search = params?.jour ? `?jour=${params.jour}` : '';
      return (await api.get<CreneauEmploiDuTemps[]>(`/enseignant/emploi-du-temps${search}`)).data;
    },
  });
}
