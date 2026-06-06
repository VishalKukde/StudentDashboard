import { useEffect, useState } from "react";
import api from "../api/client";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import LineTrendChart from "../components/LineTrendChart";
import DonutChart from "../components/DonutChart";
import CourseProgressTable from "../components/CourseProgressTable";
import RecommendationPanel from "../components/RecommendationPanel";

const StudentDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [progress, setProgress] = useState([]);
  const [trend, setTrend] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [overviewRes, progressRes, trendRes, distRes, recommendationsRes] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/progress"),
        api.get("/analytics/timeseries?range=7d"),
        api.get("/analytics/distribution"),
        api.get("/analytics/recommendations")
      ]);

      setOverview(overviewRes.data);
      setProgress(progressRes.data.progress);
      setTrend(trendRes.data.data.map((item) => ({ day: item._id.day, timeSpent: item.totalTimeSpent })));
      setDistribution(distRes.data.distribution);
      setRecommendations(recommendationsRes.data.recommendations);
    };

    load();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Courses Enrolled" value={overview?.totalCoursesEnrolled ?? "-"} hint="Active learning paths" />
          <StatCard label="Completed Lessons" value={overview?.completedLessons ?? "-"} hint="Lessons finished so far" />
          <StatCard label="Time Spent" value={`${overview?.totalTimeSpent ?? "-"} min`} hint="Tracked activity minutes" />
          <StatCard label="Learning Streak" value={`${overview?.currentLearningStreak ?? "-"} days`} hint="Consecutive study days" />
        </section>

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
  );
};

export default StudentDashboardPage;
