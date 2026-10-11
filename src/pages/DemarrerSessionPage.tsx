import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses, useCours } from '@/hooks/useCours';
import { useDemarrerSession } from '@/hooks/usePresences';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function DemarrerSessionPage() {
  const navigate = useNavigate();
  const { data: classes } = useClasses();
  const { data: matieres } = useCours();
  const demarrer = useDemarrerSession();

  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [room, setRoom] = useState('');
  const [expectedCount, setExpectedCount] = useState<number | ''>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || !subjectId || !room || !expectedCount) return;
    const session = await demarrer.mutateAsync({
      classId,
      subjectId,
      room,
      expectedCount: Number(expectedCount),
    });
    navigate(`/sessions/${session.id}`);
  }

  return (
    <Card className="mx-auto max-w-md">
      <h2 className="mb-1 font-display text-xl text-ink">Démarrer une séance</h2>
      <p className="mb-5 text-sm text-ink-faint">
        Un QR de présence sera généré dès la création de la séance.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="classe">Classe</Label>
          <select
            id="classe"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full rounded border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink"
            required
          >
            <option value="">Sélectionner une classe</option>
            {classes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="matiere">Matière</Label>
          <select
            id="matiere"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full rounded border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink"
            required
          >
            <option value="">Sélectionner une matière</option>
            {matieres?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="salle">Salle</Label>
            <Input id="salle" value={room} onChange={(e) => setRoom(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="effectif">Effectif attendu</Label>
            <Input
              id="effectif"
              type="number"
              min={1}
              value={expectedCount}
              onChange={(e) => setExpectedCount(e.target.value ? Number(e.target.value) : '')}
              required
            />
          </div>
        </div>

        {demarrer.isError && (
          <p className="rounded-sm bg-absent-bg px-3 py-2 text-sm text-absent">
            Impossible de démarrer la séance. Vérifiez les informations saisies.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={demarrer.isPending}>
          {demarrer.isPending ? 'Création…' : 'Générer le QR et démarrer'}
        </Button>
      </form>
    </Card>
  );
}
