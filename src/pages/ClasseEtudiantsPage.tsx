import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useEtudiantsClasse } from '@/hooks/useCours';
import { PageLoader } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { initiales } from '@/lib/utils';

export default function ClasseEtudiantsPage() {
  const { classeId } = useParams<{ classeId: string }>();
  const { data, isLoading } = useEtudiantsClasse(classeId);

  if (isLoading) return <PageLoader />;
  if (!data?.length) return <EmptyState icon={Users} title="Aucun étudiant dans cette classe" />;

  return (
    <div className="ledger-card divide-y divide-line">
      {data.map((e) => (
        <div key={e.id} className="ledger-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink-soft">
              {initiales(e.firstName, e.lastName)}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {e.firstName} {e.lastName}
              </p>
              <p className="text-xs text-ink-faint">{e.matricule}</p>
            </div>
          </div>
          {e.status === 'suspended' && (
            <span className="rounded-sm bg-absent-bg px-2 py-0.5 text-xs text-absent">Suspendu</span>
          )}
        </div>
      ))}
    </div>
  );
}
