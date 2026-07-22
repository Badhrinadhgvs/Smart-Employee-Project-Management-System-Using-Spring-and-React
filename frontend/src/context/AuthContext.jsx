import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('smartemp_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return !exp || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartemp_token');
    if (!token || isExpired(token)) {
      localStorage.removeItem('smartemp_token');
      localStorage.removeItem('smartemp_user');
      setUser(null);
    }
    setInitializing(false);
  }, []);

  const signIn = useCallback(async (username, password) => {
    const data = await authApi.login(username, password);
    const nextUser = {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || [],
    };
    localStorage.setItem('smartemp_token', data.token);
    localStorage.setItem('smartemp_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('smartemp_token');
    localStorage.removeItem('smartemp_user');
    setUser(null);
  }, []);

  const isAdmin = useMemo(() => user?.roles?.includes('ROLE_ADMIN'), [user]);

  const value = useMemo(
    () => ({ user, initializing, signIn, signOut, isAdmin }),
    [user, initializing, signIn, signOut, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
