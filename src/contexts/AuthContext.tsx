'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsUserLoading(true);
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const { user: userData } = await response.json();
          setUser(userData);
        }
      } catch (error) {
        setUserError(error as Error);
      } finally {
        setIsUserLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user: userData, redirectUrl } = await response.json();
        setUser(userData);
        
        // Redirect to the appropriate dashboard
        if (typeof window !== 'undefined' && redirectUrl) {
          window.location.href = redirectUrl;
        }
        
        return true;
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setUserError(error as Error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUserError(error as Error);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
        return true;
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setUserError(error as Error);
      return false;
    }
  };

  const value = {
    user,
    isUserLoading,
    userError,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}