import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/fetch';
import { useNotifs } from './useNotifs';

export interface User {
  id: number;
  name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHERS' | null;
  phone?: string;
  provider: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const { addNotification } = useNotifs();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = () => {
    const token = window.document.cookie.split(';').find(c => c.startsWith('access-token='))?.split('=')[1] ?? null;

    if (token) {
      apiFetch<User>("/api/users/me", {
        addNotification
      })
        .then(data => {
          setUser(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};