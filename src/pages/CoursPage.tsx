import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Users } from 'lucide-react';
import { useClasses, useCours } from '@/hooks/useCours';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default function CoursPage() {
  const { data: cours, isLoading: chargeCours } = useCours();
  const { data: classes, isLoading: chargeClasses } = useClasses();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes matières</CardTitle>
        </CardHeader>
        {chargeCours ? (
          <Spinner />
        ) : !cours?.length ? (
          <EmptyState icon={BookOpen} title="Aucune matière assignée" />
        ) : (
          <div>
            {cours.map((m) => (
              <Link key={m.id} to={`/cours/${m.id}`} className="ledger-row group">
                <div>
                  <p className="text-sm font-medium text-ink">{m.name}</p>
                  <p className="text-xs text-ink-faint">
                    {m.code} · {m.volumeHours}h de volume horaire
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes classes</CardTitle>
        </CardHeader>
        {chargeClasses ? (
          <Spinner />
        ) : !classes?.length ? (
          <EmptyState icon={Users} title="Aucune classe assignée" />
        ) : (
          <div>
            {classes.map((c) => (
              <Link key={c.id} to={`/classes/${c.id}/etudiants`} className="ledger-row group">
                <div>
                  <p className="text-sm font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-ink-faint">
                    {c.level} · {c.program}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-faint">{c.studentCount} étudiants</span>
                  <ChevronRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
