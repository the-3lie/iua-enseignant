import { Link } from 'react-router-dom';
import { useClasses } from '@/hooks/useCours';
import { PageLoader } from '@/components/ui/Spinner';

export default function ClassesPage() {
  const { data, isLoading } = useClasses();
  if (isLoading) return <PageLoader />;

  return (
    <div className="ledger-card divide-y divide-line">
      {data?.map((c) => (
        <Link key={c.id} to={`/classes/${c.id}/etudiants`} className="ledger-row">
          <p className="text-sm font-medium">{c.name}</p>
          <p className="text-xs text-ink-faint">{c.studentCount} étudiants</p>
        </Link>
      ))}
    </div>
  );
}
