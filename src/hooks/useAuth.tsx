import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHERS' | null;
  phone?: string;
  provider: string;
  email: string;
}

interface JwtPayload {
  iss: string;
  iat: number;
  userId: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    const token = window.document.cookie.split(';').find(c => c.startsWith('access-token='))?.split('=')[1] ?? null;
    
    if (token) {
      try {
        const { data, error } = await fetch(`/api/users/me`)
          .then((response) => {
            return response.json();
          });
        
        if (data) {
          setUser(data);
        } else {
          setUser(null);
        }

        setLoading(false);
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
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