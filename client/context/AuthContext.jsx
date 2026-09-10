'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const u = await authService.getMe();
            setUser(u);
          } catch {
            localStorage.clear();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (creds) => {
    const data = await authService.login(creds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const register = async (info) => {
    const data = await authService.register(info);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
