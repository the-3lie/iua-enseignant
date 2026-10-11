import { useEffect, useState } from 'react';
import { useModifierProfil, useProfil } from '@/hooks/useProfil';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';

export default function ProfilPage() {
  const { data, isLoading } = useProfil();
  const modifier = useModifierProfil();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName);
      setLastName(data.lastName);
    }
  }, [data]);

  if (isLoading || !data) return <PageLoader />;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    modifier.mutate({ firstName, lastName });
  }

  return (
    <Card className="max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={data.email} disabled className="opacity-60" />
          <p className="mt-1 text-xs text-ink-faint">L'email n'est pas modifiable.</p>
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <Input id="statut" value={data.status === 'active' ? 'Actif' : 'Suspendu'} disabled className="opacity-60" />
        </div>

        {modifier.isSuccess && (
          <p className="rounded-sm bg-present-bg px-3 py-2 text-sm text-present">Profil mis à jour.</p>
        )}

        <Button type="submit" disabled={modifier.isPending}>
          {modifier.isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </Button>
      </form>
    </Card>
  );
}
