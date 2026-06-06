"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

const navLinkClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    active ? "bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const goHome = () => {
    router.push(user?.role === "mentor" ? "/mentor" : "/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={goHome} className="text-left font-[family-name:var(--font-grotesk)] text-lg font-semibold tracking-tight text-slate-950 transition hover:text-slate-700">
            Progressive Student Dashboard
          </button>
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <Link className={navLinkClass(pathname === "/dashboard" || pathname === "/mentor")} href={user?.role === "mentor" ? "/mentor" : "/dashboard"}>
              Dashboard
            </Link>
            <Link className={navLinkClass(pathname === "/lessons")} href="/lessons">
              Lessons
            </Link>
            <button onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};