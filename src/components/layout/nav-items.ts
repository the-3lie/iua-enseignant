import {
  LayoutGrid,
  CalendarDays,
  BookOpen,
  History,
  BarChart3,
  Bell,
  UserRound,
} from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Tableau de bord', icon: LayoutGrid, end: true },
  { to: '/emploi-du-temps', label: 'Emploi du temps', icon: CalendarDays, end: false },
  { to: '/cours', label: 'Mes cours', icon: BookOpen, end: false },
  { to: '/historique', label: 'Historique', icon: History, end: false },
  { to: '/statistiques', label: 'Statistiques', icon: BarChart3, end: false },
  { to: '/notifications', label: 'Notifications', icon: Bell, end: false },
  { to: '/profil', label: 'Mon profil', icon: UserRound, end: false },
] as const;

// Sous-ensemble affiché dans la barre de navigation mobile (5 max)
export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[4],
  NAV_ITEMS[6],
];
