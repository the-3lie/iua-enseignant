import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, Timer, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import {
  useClorerSession,
  useMarquerAbsence,
  useMarquerRetard,
  useModifierPresence,
  useSession,
} from '@/hooks/usePresences';
import { useEtudiantsClasse } from '@/hooks/useCours';
import { PageLoader } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { cn, initiales } from '@/lib/utils';
import type { Presence, StatutPresence } from '@/types';

function useCompteAReboursMMSS(cible?: string | null) {
  const [restant, setRestant] = useState('--:--');
  useEffect(() => {
    if (!cible) return;
    const tick = () => {
      const diffMs = new Date(cible).getTime() - Date.now();
      if (diffMs <= 0) {
        setRestant('00:00');
        return;
      }
      const totalSec = Math.floor(diffMs / 1000);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const ss = String(totalSec % 60).padStart(2, '0');
      setRestant(`${mm}:${ss}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cible]);
  return restant;
}

export default function SessionLivePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useSession(id);
  const { data: etudiants } = useEtudiantsClasse(session?.classId);
  const marquerAbsence = useMarquerAbsence(id!);
  const marquerRetard = useMarquerRetard(id!);
  const modifierPresence = useModifierPresence(id!);
  const cloturer = useClorerSession();

  const restant = useCompteAReboursMMSS(session?.qrValidUntil);
  const expire = restant === '00:00';

  if (isLoading || !session) return <PageLoader />;

  const presencesParEtudiant = new Map<string, Presence>(
    (session.attendanceRecords ?? []).map((p) => [p.studentId, p]),
  );
  const nbPresents = [...presencesParEtudiant.values()].filter((p) => p.status === 'present').length;

  async function onCloturer() {
    await cloturer.mutateAsync(id!);
    navigate('/');
  }

  function statutDe(etudiantId: string): StatutPresence | 'attente' {
    return presencesParEtudiant.get(etudiantId)?.status ?? 'attente';
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Barre supérieure */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-paper/50">
            {session.class?.name} · Salle {session.room}
          </p>
          <h1 className="font-display text-lg md:text-xl">{session.subject?.name ?? 'Séance'}</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-paper/70 hover:bg-white/10 hover:text-paper"
          aria-label="Quitter le mode présentation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-8 px-5 pb-32 md:grid-cols-2 md:px-8 md:pb-12">
        {/* Le QR — le moment fort de l'écran */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="rounded-lg bg-paper p-5">
            <QRCodeSVG
              value={session.qrTokenHash ?? session.id}
              size={240}
              bgColor="#F5F6F0"
              fgColor="#16243D"
            />
          </div>

          <div
            className={cn(
              'mt-5 flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm',
              expire ? 'border-absent text-absent' : 'border-gold/50 text-gold-soft',
            )}
          >
            <Timer className="h-4 w-4" />
            {expire ? 'QR expiré' : `Expire dans ${restant}`}
          </div>

          <p className="mt-4 text-sm text-paper/60">
            {nbPresents} / {session.expectedCount} étudiants pointés
          </p>
        </div>

        {/* Liste en direct des étudiants */}
        <div className="rounded-lg bg-paper/[0.04] p-1">
          <div className="max-h-[60vh] divide-y divide-white/10 overflow-y-auto md:max-h-[70vh]">
            {etudiants?.map((e) => {
              const statut = statutDe(e.id);
              const presence = presencesParEtudiant.get(e.id);
              return (
                <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                      {initiales(e.firstName, e.lastName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {e.firstName} {e.lastName}
                      </p>
                      <p className="text-xs text-paper/50">{e.matricule}</p>
                    </div>
                  </div>

                  {statut === 'present' ? (
                    <button
                      onClick={() =>
                        presence && modifierPresence.mutate({ presenceId: presence.id, status: 'late' })
                      }
                      className="flex items-center gap-1.5 rounded-full bg-present-bg px-2.5 py-1 text-xs font-medium text-present"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Présent
                    </button>
                  ) : statut === 'late' ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-late-bg px-2.5 py-1 text-xs font-medium text-late">
                      <Clock3 className="h-3.5 w-3.5" /> Retard
                    </span>
                  ) : statut === 'absent' ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-absent-bg px-2.5 py-1 text-xs font-medium text-absent">
                      <XCircle className="h-3.5 w-3.5" /> Absent
                    </span>
                  ) : (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => marquerRetard.mutate(e.id)}
                        className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-paper/70 hover:bg-white/10"
                      >
                        Retard
                      </button>
                      <button
                        onClick={() => marquerAbsence.mutate(e.id)}
                        className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-paper/70 hover:bg-white/10"
                      >
                        Absent
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barre d'action fixe */}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-ink/95 px-5 py-4 backdrop-blur md:px-8">
        <Button
          variant="danger"
          className="mx-auto flex w-full max-w-md"
          onClick={onCloturer}
          disabled={cloturer.isPending}
        >
          {cloturer.isPending ? 'Clôture…' : 'Clôturer la séance'}
        </Button>
      </div>
    </div>
  );
}
