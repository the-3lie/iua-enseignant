export type StatutPresence = 'present' | 'late' | 'absent' | 'rejected';
export type StatutSession = 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';
export type TypeNotification =
  | 'session_imminent'
  | 'qr_available'
  | 'qr_expiring'
  | 'session_cancelled'
  | 'absence_recorded'
  | 'admin_info';

export interface Enseignant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended';
  establishmentId: string;
}

export interface Matiere {
  id: string;
  name: string;
  code: string;
  volumeHours: number;
}

export interface Classe {
  id: string;
  name: string;
  level: string;
  program: string;
  studentCount: number;
}

export interface Etudiant {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended';
}

export interface CreneauEmploiDuTemps {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  room: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  conflict?: 'teacher' | 'room' | null;
  class?: Classe;
  subject?: Matiere;
}

export interface SessionPresence {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  status: StatutSession;
  expectedCount: number;
  qrTokenHash?: string | null;
  qrGeneratedAt?: string | null;
  qrValidUntil?: string | null;
  qrRegenerations: number;
  class?: Classe;
  subject?: Matiere;
  attendanceRecords?: Presence[];
}

export interface Presence {
  id: string;
  sessionId: string;
  studentId: string;
  scannedAt?: string | null;
  status: StatutPresence;
  rejectionReason?: string | null;
  student?: Etudiant;
}

export interface Notification {
  id: string;
  type: TypeNotification;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface StatistiquesGlobales {
  tauxPresence: number;
  totalSeances: number;
  totalEtudiants: number;
  totalAbsences: number;
  totalRetards: number;
}
