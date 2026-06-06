import { useEffect, useState } from "react";
import api from "../api/client";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";

const MentorDashboardPage = () => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/analytics/mentor");
      setOverview(data);
    };

    load();
  }, []);

  return (
    <Layout>
      <div className="space-y-8 text-slate-900">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Students" value={overview?.totalStudents ?? "-"} hint="Active mentees" />
          <StatCard label="Avg Completion" value={`${overview?.averageCompletionPercentage ?? "-"}%`} hint="Across all tracked learners" />
          <StatCard label="Avg Learning Hours" value={`${overview?.averageLearningHours ?? "-"} hrs`} hint="Study time across students" />
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Top Performing Students">
            <div className="space-y-3">
              {overview?.leaderboard?.map((student, index) => (
                <div key={student.studentId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">Student #{index + 1}</p>
                    <p className="text-sm text-slate-500">{student.learningHours} learning hours</p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">{student.completionPercentage}%</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="At-Risk Students">
            <div className="space-y-3">
              {overview?.atRiskStudents?.map((student) => (
                <div key={student.studentId} className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="font-medium text-amber-900">Completion {student.completionPercentage}%</p>
                  <p className="text-sm text-amber-800">No activity in the last 7 days or under 20% progress</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </Layout>
  );
};

export default MentorDashboardPage;
