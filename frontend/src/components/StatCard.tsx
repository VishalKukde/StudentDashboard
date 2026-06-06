"use client";

export const StatCard = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <h3 className="mt-3 font-[family-name:var(--font-grotesk)] text-3xl font-semibold text-slate-950">{value}</h3>
      </div>
      <span className="mt-1 h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100" />
    </div>
    {hint ? <p className="mt-3 text-sm leading-6 text-slate-500">{hint}</p> : null}
  </article>
);