import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, SupabaseConnectionStatus } from '../types';
import { getCurrentUser, signOut as authSignOut } from '../services/authService';
import { isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile;
  supabaseStatus: SupabaseConnectionStatus;
  refreshSupabaseStatus: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>({
    id: 'guest_init',
    email: 'citizen.guest@nyayamate.in',
    fullName: 'Citizen User',
    isGuest: true,
  });

  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus>({
    isConfigured: false,
    isConnected: false,
    latencyMs: undefined,
  });

  const checkConnection = async () => {
    const configured = isSupabaseConfigured();
    if (!configured) {
      setSupabaseStatus({
        isConfigured: false,
        isConnected: false,
        error: 'Supabase credentials not configured. Using local offline storage.',
      });
      return;
    }

    const test = await testSupabaseConnection();
    setSupabaseStatus({
      isConfigured: true,
      isConnected: test.success,
      latencyMs: test.latencyMs,
      error: test.success ? null : test.message,
    });
  };

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await checkConnection();
    };
    init();
  }, []);

  const handleSignOut = async () => {
    await authSignOut();
    const guest = await getCurrentUser();
    setUser(guest);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseStatus,
        refreshSupabaseStatus: checkConnection,
        setUser,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
