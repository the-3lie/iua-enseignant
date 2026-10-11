import { Link } from 'react-router-dom';
import { QrCode, ArrowRight, CalendarClock, Users } from 'lucide-react';
import { useSessionsActives } from '@/hooks/usePresences';
import { useEmploiDuTemps } from '@/hooks/useEmploiDuTemps';
import { useStatistiquesGlobales } from '@/hooks/useStatistiques';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { nomJour } from '@/lib/utils';

const JOUR_ISO_AUJOURDHUI = (() => {
  const j = new Date().getDay(); // 0 = dimanche
  return j === 0 ? 7 : j;
})();

export default function DashboardPage() {
  const { data: sessionsActives, isLoading: chargeSessions } = useSessionsActives();
  const { data: creneauxDuJour, isLoading: chargeCreneaux } = useEmploiDuTemps({
    jour: JOUR_ISO_AUJOURDHUI,
  });
  const { data: stats } = useStatistiquesGlobales();

  const aUneSessionActive = !chargeSessions && !!sessionsActives?.length;

  return (
    <div className="space-y-6">
      {/* Bandeau session active — le moment le plus important du tableau de bord */}
      {aUneSessionActive ? (
        <Link
          to={`/sessions/${sessionsActives![0].id}`}
          className="flex items-center justify-between rounded-lg bg-ink px-6 py-5 text-paper transition-colors hover:bg-ink-soft"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/20">
              <QrCode className="h-5 w-5 text-gold-soft" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-paper/60">Séance en cours</p>
              <p className="font-display text-lg">
                {sessionsActives![0].subject?.name ?? 'Cours'} — {sessionsActives![0].class?.name ?? ''}
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      ) : (
        <Card className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg">Aucune séance en cours</p>
            <p className="text-sm text-ink-faint">Démarrez une séance pour générer un QR de présence.</p>
          </div>
          <Link to="/sessions/nouvelle">
            <Button>Démarrer une séance</Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Taux de présence', value: stats ? `${Math.round(stats.tauxPresence)}%` : '—' },
          { label: 'Séances tenues', value: stats?.totalSeances ?? '—' },
          { label: 'Étudiants suivis', value: stats?.totalEtudiants ?? '—' },
          { label: 'Absences relevées', value: stats?.totalAbsences ?? '—' },
        ].map((item) => (
          <div key={item.label} className="ledger-card px-4 py-3.5">
            <p className="font-display text-2xl text-ink">{item.value}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{item.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aujourd'hui — {nomJour(JOUR_ISO_AUJOURDHUI)}</CardTitle>
          <Link to="/emploi-du-temps" className="text-sm text-ink-faint hover:text-ink">
            Voir la semaine
          </Link>
        </CardHeader>

        {chargeCreneaux ? (
          <Spinner />
        ) : creneauxDuJour?.length ? (
          <div>
            {creneauxDuJour.map((c) => (
              <div key={c.id} className="ledger-row">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-4 w-4 shrink-0 text-ink-faint" />
                  <div>
                    <p className="text-sm font-medium text-ink">{c.subject?.name ?? 'Cours'}</p>
                    <p className="text-xs text-ink-faint">
                      {c.startTime}–{c.endTime} · Salle {c.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                  <Users className="h-3.5 w-3.5" />
                  {c.class?.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-ink-faint">Pas de cours prévu aujourd'hui.</p>
        )}
      </Card>
    </div>
  );
}
