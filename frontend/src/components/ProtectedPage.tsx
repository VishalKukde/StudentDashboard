"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import type { UserRole } from "../lib/types";

export const ProtectedPage = ({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!roles.includes(user.role)) {
      router.replace(user.role === "mentor" ? "/mentor" : "/dashboard");
    }
  }, [loading, user, roles, router]);

  if (loading || !user || !roles.includes(user.role)) {
    return <div className="grid min-h-[60vh] place-items-center text-slate-500">Loading dashboard...</div>;
  }

  return <>{children}</>;
};
