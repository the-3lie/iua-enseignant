import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { History } from 'lucide-react';
import {
  useHistoriqueAbsences,
  useHistoriquePresences,
  useHistoriqueRetards,
  useHistoriqueSessions,
} from '@/hooks/useHistorique';
import { PageLoader } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const ONGLETS = [
  { id: 'sessions', label: 'Séances' },
  { id: 'presences', label: 'Présences' },
  { id: 'absences', label: 'Absences' },
  { id: 'retards', label: 'Retards' },
] as const;

type OngletId = (typeof ONGLETS)[number]['id'];

export default function HistoriquePage() {
  const [onglet, setOnglet] = useState<OngletId>('sessions');

  const sessions = useHistoriqueSessions();
  const presences = useHistoriquePresences();
  const absences = useHistoriqueAbsences();
  const retards = useHistoriqueRetards();

  const parOnglet = { sessions, presences, absences, retards } as const;
  const { data, isLoading } = parOnglet[onglet];

  return (
    <div className="space-y-5">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {ONGLETS.map((o) => (
          <button
            key={o.id}
            onClick={() => setOnglet(o.id)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              onglet === o.id ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !Array.isArray(data) || !data.length ? (
        <EmptyState icon={History} title="Rien à afficher" description="Aucun élément dans cette catégorie." />
      ) : (
        <div className="ledger-card divide-y divide-line">
          {data.map((item: any) => (
            <div key={item.id} className="ledger-row">
              <div>
                <p className="text-sm font-medium text-ink">
                  {item.subject?.name ??
                    (item.student ? `${item.student.firstName} ${item.student.lastName}` : 'Élément')}
                </p>
                <p className="text-xs text-ink-faint">
                  {item.date ? format(new Date(item.date), 'd MMMM yyyy', { locale: fr }) : ''}
                  {item.class?.name ? ` · ${item.class.name}` : ''}
                </p>
              </div>
              {item.status && (
                <span className="text-xs uppercase tracking-wide text-ink-faint">{item.status}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
