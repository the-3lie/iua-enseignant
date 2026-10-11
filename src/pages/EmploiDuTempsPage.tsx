import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useEmploiDuTemps } from '@/hooks/useEmploiDuTemps';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, nomJour } from '@/lib/utils';

const JOURS_OUVRES = [1, 2, 3, 4, 5, 6];

export default function EmploiDuTempsPage() {
  const [jour, setJour] = useState<number | undefined>(undefined);
  const { data, isLoading } = useEmploiDuTemps({ jour });

  return (
    <div className="space-y-5">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setJour(undefined)}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
            jour === undefined ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft',
          )}
        >
          Toute la semaine
        </button>
        {JOURS_OUVRES.map((j) => (
          <button
            key={j}
            onClick={() => setJour(j)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              jour === j ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft',
            )}
          >
            {nomJour(j).slice(0, 3)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState icon={CalendarDays} title="Rien de prévu" description="Aucun créneau pour cette période." />
      ) : (
        <div className="ledger-card divide-y divide-line">
          {Object.entries(
            data.reduce<Record<number, typeof data>>((acc, c) => {
              (acc[c.dayOfWeek] ??= []).push(c);
              return acc;
            }, {}),
          )
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([j, creneaux]) => (
              <div key={j} className="px-5 py-4">
                <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {nomJour(Number(j))}
                </p>
                <div className="space-y-3">
                  {creneaux
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((c) => (
                      <div key={c.id} className="flex items-center gap-4">
                        <div className="w-16 shrink-0 font-mono text-xs text-ink-faint">
                          {c.startTime}
                        </div>
                        <div className="flex-1 border-l-2 border-gold/50 pl-3">
                          <p className="text-sm font-medium text-ink">{c.subject?.name ?? 'Cours'}</p>
                          <p className="text-xs text-ink-faint">
                            {c.class?.name} · Salle {c.room}
                          </p>
                        </div>
                        {c.conflict && (
                          <span className="rounded-sm bg-absent-bg px-2 py-0.5 text-xs text-absent">
                            Conflit {c.conflict === 'teacher' ? 'enseignant' : 'salle'}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
