import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '@/components/RequireAuth';
import { AppShell } from '@/components/layout/AppShell';

import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import EmploiDuTempsPage from '@/pages/EmploiDuTempsPage';
import CoursPage from '@/pages/CoursPage';
import CoursDetailPage from '@/pages/CoursDetailPage';
import ClassesPage from '@/pages/ClassesPage';
import ClasseEtudiantsPage from '@/pages/ClasseEtudiantsPage';
import SessionLivePage from '@/pages/SessionLivePage';
import DemarrerSessionPage from '@/pages/DemarrerSessionPage';
import HistoriquePage from '@/pages/HistoriquePage';
import StatistiquesPage from '@/pages/StatistiquesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilPage from '@/pages/ProfilPage';

function Protected({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell title={title}>{children}</AppShell>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />

      <Route path="/" element={<Protected title="Tableau de bord"><DashboardPage /></Protected>} />
      <Route path="/emploi-du-temps" element={<Protected title="Emploi du temps"><EmploiDuTempsPage /></Protected>} />
      <Route path="/cours" element={<Protected title="Mes cours"><CoursPage /></Protected>} />
      <Route path="/cours/:id" element={<Protected title="Détail du cours"><CoursDetailPage /></Protected>} />
      <Route path="/classes" element={<Protected title="Mes classes"><ClassesPage /></Protected>} />
      <Route path="/classes/:classeId/etudiants" element={<Protected title="Étudiants"><ClasseEtudiantsPage /></Protected>} />
      <Route path="/sessions/nouvelle" element={<Protected title="Démarrer une séance"><DemarrerSessionPage /></Protected>} />
      {/* Écran "mode présentation" : pas de coquille de navigation, prend tout l'écran */}
      <Route path="/sessions/:id" element={<RequireAuth><SessionLivePage /></RequireAuth>} />
      <Route path="/historique" element={<Protected title="Historique"><HistoriquePage /></Protected>} />
      <Route path="/statistiques" element={<Protected title="Statistiques"><StatistiquesPage /></Protected>} />
      <Route path="/notifications" element={<Protected title="Notifications"><NotificationsPage /></Protected>} />
      <Route path="/profil" element={<Protected title="Mon profil"><ProfilPage /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
