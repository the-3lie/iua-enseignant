import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useStatistiquesClasses, useStatistiquesCours, useStatistiquesGlobales } from '@/hooks/useStatistiques';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function StatistiquesPage() {
  const { data: globales } = useStatistiquesGlobales();
  const { data: parClasse, isLoading: chargeClasses } = useStatistiquesClasses();
  const { data: parCours, isLoading: chargeCours } = useStatistiquesCours();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Taux de présence', value: globales ? `${Math.round(globales.tauxPresence)}%` : '—' },
          { label: 'Séances tenues', value: globales?.totalSeances ?? '—' },
          { label: 'Absences', value: globales?.totalAbsences ?? '—' },
          { label: 'Retards', value: globales?.totalRetards ?? '—' },
        ].map((item) => (
          <div key={item.label} className="ledger-card px-4 py-3.5">
            <p className="font-display text-2xl text-ink">{item.value}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{item.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assiduité par classe</CardTitle>
        </CardHeader>
        {chargeClasses ? (
          <Spinner />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.isArray(parClasse) ? parClasse : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADFD6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#7C879C' }}
                  axisLine={{ stroke: '#DADFD6' }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12, fill: '#7C879C' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 6, borderColor: '#DADFD6', fontSize: 13 }}
                  cursor={{ fill: '#16243D0A' }}
                />
                <Bar dataKey="tauxPresence" name="Taux de présence" fill="#B8863B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assiduité par matière</CardTitle>
        </CardHeader>
        {chargeCours ? (
          <Spinner />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.isArray(parCours) ? parCours : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADFD6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#7C879C' }}
                  axisLine={{ stroke: '#DADFD6' }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12, fill: '#7C879C' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 6, borderColor: '#DADFD6', fontSize: 13 }}
                  cursor={{ fill: '#16243D0A' }}
                />
                <Bar dataKey="tauxPresence" name="Taux de présence" fill="#16243D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
