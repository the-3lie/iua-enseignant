import { useParams } from 'react-router-dom';
import { useCoursDetail } from '@/hooks/useCours';
import { PageLoader } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

export default function CoursDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCoursDetail(id);

  if (isLoading) return <PageLoader />;
  if (!data) return <p className="text-sm text-ink-faint">Cours introuvable.</p>;

  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-ink-faint">{data.code}</p>
      <h2 className="mt-1 font-display text-2xl text-ink">{data.name}</h2>
      <p className="mt-3 text-sm text-ink-soft">Volume horaire total : {data.volumeHours} heures</p>
    </Card>
  );
}
