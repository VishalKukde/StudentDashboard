"use client";

import type { RecommendationItem } from "../lib/types";

export const RecommendationPanel = ({ recommendations }: { recommendations: RecommendationItem[] }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {recommendations.map((item) => (
      <article key={item.courseId} className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">{item.courseName}</p>
        <h3 className="mt-2 font-[family-name:var(--font-grotesk)] text-lg font-semibold text-slate-950">{Math.round(item.completionPercentage)}% complete</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {item.suggestions.map((suggestion) => (
            <li key={suggestion} className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="leading-6">{suggestion}</span>
            </li>
          ))}
        </ul>
      </article>
    ))}
  </div>
);