import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, BellOff } from 'lucide-react';
import { useMarquerNotificationLue, useMarquerToutesLues, useNotifications } from '@/hooks/useNotifications';
import { PageLoader } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const marquerLue = useMarquerNotificationLue();
  const marquerToutesLues = useMarquerToutesLues();

  if (isLoading) return <PageLoader />;
  if (!data?.length) return <EmptyState icon={BellOff} title="Aucune notification" />;

  const nonLues = data.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {nonLues > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => marquerToutesLues.mutate()}
            className="text-sm text-ink-faint underline decoration-dotted underline-offset-2 hover:text-ink"
          >
            Tout marquer comme lu ({nonLues})
          </button>
        </div>
      )}

      <div className="ledger-card divide-y divide-line">
        {data.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.read && marquerLue.mutate(n.id)}
            className="flex w-full items-start gap-3 px-5 py-4 text-left"
          >
            <span
              className={cn(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                n.read ? 'bg-transparent' : 'bg-gold',
              )}
            />
            <div className="flex-1">
              <p className={cn('text-sm', n.read ? 'text-ink-soft' : 'font-medium text-ink')}>{n.title}</p>
              <p className="mt-0.5 text-sm text-ink-faint">{n.body}</p>
              <p className="mt-1 text-xs text-ink-faint">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
              </p>
            </div>
            <Bell className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
}
