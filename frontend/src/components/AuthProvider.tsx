"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import type { AuthResponse, User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; role: "student" | "mentor" }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get<{ user: User }>("/auth/profile");
        setUser(data.user);
      } catch {
        window.localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    window.localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: { name: string; email: string; password: string; role: "student" | "mentor" }) => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    window.localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
