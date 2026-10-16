import React from '../reactRuntime.js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, logout as logoutRequest } from '../api/authApi.js';
import { setAccessToken, setUnauthorizedHandler } from '../api/apiClient.js';

const AuthContext = createContext(null);
const DEMO_SESSION_KEY = 'clearline-demo-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(DEMO_SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) setAccessToken(user.token);
  }, [user]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setAccessToken(null);
      try { sessionStorage.removeItem(DEMO_SESSION_KEY); } catch { /* storage is optional */ }
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  async function signIn(credentials) {
    setLoading(true);
    try {
      const session = await loginRequest(credentials);
      const nextUser = { ...session.user, token: session.token || null };
      setUser(nextUser);
      if (session.demo) sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(nextUser));
      else sessionStorage.removeItem(DEMO_SESSION_KEY);
      setAccessToken(nextUser.token);
      return nextUser;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    void logoutRequest().catch(() => {});
    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  }

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
