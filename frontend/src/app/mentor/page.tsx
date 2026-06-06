"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { ProtectedPage } from "../../components/ProtectedPage";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/StatCard";
import { SectionCard } from "../../components/SectionCard";
import { ExportActions } from "../../components/ExportActions";

interface MentorOverview {
  totalStudents: number;
  averageCompletionPercentage: number;
  averageLearningHours: number;
  leaderboard: Array<{ studentId: string; completionPercentage: number; learningHours: number; lastActivity: string | null }>;
  atRiskStudents: Array<{ studentId: string; completionPercentage: number; learningHours: number; lastActivity: string | null }>;
}

export default function MentorDashboardPage() {
  const [overview, setOverview] = useState<MentorOverview | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get<MentorOverview>("/analytics/mentor");
      setOverview(data);
    };

    void load();
  }, []);

  return (
    <ProtectedPage roles={["mentor"]}>
      <Layout>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Mentor dashboard</p>
                <h1 className="mt-3 font-[family-name:var(--font-grotesk)] text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Monitor student progress and spot support opportunities quickly.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Review performance, compare completion rates, and focus on the students who need a touchpoint this week.
                </p>
              </div>
              <div className="grid gap-3 sm:min-w-[340px] sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Focus</p>
                  <p className="mt-2 font-semibold text-slate-900">Support and guidance</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">View</p>
                  <p className="mt-2 font-semibold text-slate-900">Performance overview</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Students" value={overview?.totalStudents ?? "-"} hint="Active mentees" />
            <StatCard label="Avg Completion" value={`${overview?.averageCompletionPercentage ?? "-"}%`} hint="Across all tracked learners" />
            <StatCard label="Avg Learning Hours" value={`${overview?.averageLearningHours ?? "-"} hrs`} hint="Study time across students" />
          </section>

          <SectionCard title="CSV Export">
            <ExportActions mentor />
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Top Performing Students">
              <div className="space-y-3">
                {overview?.leaderboard?.map((student, index) => (
                  <div key={student.studentId} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-950">Student #{index + 1}</p>
                      <p className="text-sm text-slate-500">{student.learningHours.toFixed(1)} learning hours</p>
                    </div>
                    <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{student.completionPercentage}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="At-Risk Students">
              <div className="space-y-3">
                {overview?.atRiskStudents?.map((student) => (
                  <div key={student.studentId} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                    <p className="font-medium text-amber-950">Completion {student.completionPercentage}%</p>
                    <p className="text-sm text-amber-800">No activity in the last 7 days or under 20% progress</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </Layout>
    </ProtectedPage>
  );
}