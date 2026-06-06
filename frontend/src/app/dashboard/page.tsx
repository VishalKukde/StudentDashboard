"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { ProtectedPage } from "../../components/ProtectedPage";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/StatCard";
import { SectionCard } from "../../components/SectionCard";
import { LineTrendChart } from "../../components/LineTrendChart";
import { DonutChart } from "../../components/DonutChart";
import { CourseProgressTable } from "../../components/CourseProgressTable";
import { RecommendationPanel } from "../../components/RecommendationPanel";
import { ExportActions } from "../../components/ExportActions";
import type { DashboardOverview, CourseProgressItem, RecommendationItem } from "../../lib/types";
import type { TrendPoint } from "../../components/LineTrendChart";

type DistributionItem = { name: string; value: number };

export default function StudentDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [progress, setProgress] = useState<CourseProgressItem[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [distribution, setDistribution] = useState<DistributionItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const [overviewRes, progressRes, trendRes, distRes, recommendationsRes] = await Promise.all([
        api.get<DashboardOverview>("/analytics/overview"),
        api.get<{ progress: CourseProgressItem[] }>("/analytics/progress"),
        api.get<{ data: Array<{ _id: { day: string }; totalTimeSpent: number }> }>("/analytics/timeseries?range=7d"),
        api.get<{ distribution: DistributionItem[] }>("/analytics/distribution"),
        api.get<{ recommendations: RecommendationItem[] }>("/analytics/recommendations")
      ]);

      setOverview(overviewRes.data);
      setProgress(progressRes.data.progress);
      setTrend(trendRes.data.data.map((item) => ({ day: item._id.day, timeSpent: item.totalTimeSpent })));
      setDistribution(distRes.data.distribution);
      setRecommendations(recommendationsRes.data.recommendations);
    };

    void load();
  }, []);

  return (
    <ProtectedPage roles={["student"]}>
      <Layout>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Student dashboard</p>
                <h1 className="mt-3 font-[family-name:var(--font-grotesk)] text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  A clear view of progress, streaks, and the next lesson to tackle.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Track your momentum across courses, compare completion trends, and use personalized recommendations to keep learning moving forward.
                </p>
              </div>
              <div className="grid gap-3 sm:min-w-[340px] sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                  <p className="mt-2 font-semibold text-slate-900">Active learner</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mode</p>
                  <p className="mt-2 font-semibold text-slate-900">Focus dashboard</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Courses Enrolled" value={overview?.totalCoursesEnrolled ?? "-"} hint="Active learning paths" />
            <StatCard label="Completed Lessons" value={overview?.completedLessons ?? "-"} hint="Lessons finished so far" />
            <StatCard label="Time Spent" value={`${overview?.totalTimeSpent ?? "-"} min`} hint="Tracked activity minutes" />
            <StatCard label="Learning Streak" value={`${overview?.currentLearningStreak ?? "-"} days`} hint="Consecutive study days" />
          </section>

          <SectionCard title="CSV Export">
            <ExportActions />
          </SectionCard>

          <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            <SectionCard title="Study Trend">
              <LineTrendChart data={trend} />
            </SectionCard>
            <SectionCard title="Lesson Distribution">
              <DonutChart data={distribution} />
            </SectionCard>
          </section>

          <SectionCard title="Course Progress">
            <CourseProgressTable courses={progress} />
          </SectionCard>

          <SectionCard title="Adaptive Recommendations">
            <RecommendationPanel recommendations={recommendations} />
          </SectionCard>
        </div>
      </Layout>
    </ProtectedPage>
  );
}