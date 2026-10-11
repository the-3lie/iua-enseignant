import { cn } from '@/lib/utils';
import type { StatutPresence } from '@/types';

const config: Record<StatutPresence, { label: string; className: string }> = {
  present: { label: 'Présent', className: 'text-present bg-present-bg' },
  late: { label: 'Retard', className: 'text-late bg-late-bg' },
  absent: { label: 'Absent', className: 'text-absent bg-absent-bg' },
  rejected: { label: 'Rejeté', className: 'text-ink-faint bg-ink/5' },
};

export function StatutBadge({ statut }: { statut: StatutPresence }) {
  const c = config[statut];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tabular-nums',
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}
