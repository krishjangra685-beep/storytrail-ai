'use client';

import { useState, useCallback, createContext, useContext, useEffect, ReactNode } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock User object for testing without Firebase
const mockUser = {
  uid: 'mock-user-123',
  email: 'tester@storytrail.ai',
  displayName: 'StoryTrail Tester',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
} as unknown as User;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      // Check if we saved a mock session in sessionStorage
      const hasSession = sessionStorage.getItem('mock-auth-session');
      if (hasSession) {
        setUser(mockUser);
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    sessionStorage.setItem('mock-auth-session', 'true');
    setUser({ ...mockUser, email });
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    sessionStorage.setItem('mock-auth-session', 'true');
    setUser({ ...mockUser, email, displayName });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    sessionStorage.setItem('mock-auth-session', 'true');
    setUser(mockUser);
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.removeItem('mock-auth-session');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
