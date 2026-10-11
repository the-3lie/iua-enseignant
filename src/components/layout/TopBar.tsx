import { Link } from 'react-router-dom';
import { Bell, GraduationCap } from 'lucide-react';
import { useCompteurNotifications } from '@/hooks/useNotifications';

export function TopBar({ title }: { title: string }) {
  const { data } = useCompteurNotifications();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3.5 backdrop-blur md:px-8 md:py-5">
      <div className="flex items-center gap-2 md:hidden">
        <GraduationCap className="h-5 w-5 text-gold-deep" strokeWidth={1.75} />
      </div>
      <h1 className="font-display text-xl text-ink md:text-2xl">{title}</h1>
      <Link
        to="/notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 md:hidden"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {!!data?.count && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
        )}
      </Link>
    </header>
  );
}
