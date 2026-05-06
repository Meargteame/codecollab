"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { auth, users, tokens, UserProfile } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokens.getAccess();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      // Try GET /api/v1/auth/me first, fall back to GET /api/v1/users/me
      let profile: UserProfile;
      try {
        profile = await auth.me();
      } catch {
        profile = await users.getMe();
      }
      setUser(profile);
    } catch (err) {
      console.error("[AuthContext] Failed to load user:", err);
      setUser(null);
      tokens.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await auth.logout();
    } catch {
      // ignore — clear tokens regardless
    }
    tokens.clear();
    window.location.href = "/signin";
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
