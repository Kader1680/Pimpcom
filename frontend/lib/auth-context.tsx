'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<User>('/auth/me')
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', res.accessToken);
    setUser(res.user);
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/register', {
      name,
      email,
      password,
    });
    localStorage.setItem('token', res.accessToken);
    setUser(res.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
