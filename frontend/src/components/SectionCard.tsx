"use client";

import type { ReactNode } from "react";

export const SectionCard = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
  <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <h2 className="font-[family-name:var(--font-grotesk)] text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
      </div>
      {action}
    </div>
    {children}
  </section>
);