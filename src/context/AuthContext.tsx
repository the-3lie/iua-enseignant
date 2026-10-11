import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, clearToken, getToken, setToken } from '@/lib/api';
import type { Enseignant } from '@/types';

interface AuthContextValue {
  enseignant: Enseignant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [enseignant, setEnseignant] = useState<Enseignant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function chargerProfil() {
    try {
      const { data } = await api.get<Enseignant>('/enseignant/profil');
      setEnseignant(data);
    } catch {
      clearToken();
      setEnseignant(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (getToken()) {
      chargerProfil();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function connexion(email: string, motDePasse: string) {
    const { data } = await api.post<{ accessToken: string }>('/enseignant/auth/login', {
      email,
      password: motDePasse,
    });
    setToken(data.accessToken);
    await chargerProfil();
  }

  function deconnexion() {
    clearToken();
    setEnseignant(null);
  }

  return (
    <AuthContext.Provider
      value={{ enseignant, isLoading, isAuthenticated: !!enseignant, connexion, deconnexion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
