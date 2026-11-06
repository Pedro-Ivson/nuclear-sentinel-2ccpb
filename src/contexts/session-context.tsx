import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authenticateUser } from '@/services/auth-service';
import type { User } from '@/types';

const SESSION_KEY = '@nuclear-sentinel/session/v1';

interface SessionContextValue {
  user: User | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(SESSION_KEY)
      .then((stored) => {
        if (!mounted || !stored) {
          return;
        }

        try {
          setUser(JSON.parse(stored) as User);
        } catch {
          return;
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const authenticatedUser = authenticateUser(email, password);
    if (!authenticatedUser) {
      return false;
    }

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    return true;
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, signIn, signOut }),
    [user, isReady, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession precisa estar dentro de SessionProvider.');
  }
  return context;
}
