import { useEffect, useState } from "react";
import api from "../api/client";
import Layout from "../components/Layout";
import ActivityForm from "../components/ActivityForm";
import SectionCard from "../components/SectionCard";

const LessonsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/courses");
      setCourses(data.courses);
      if (data.courses.length) {
        setSelectedCourse(data.courses[0]);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadCourse = async () => {
      if (!selectedCourse?._id) return;
      const { data } = await api.get(`/courses/${selectedCourse._id}`);
      setLessons(data.lessons || []);
    };

    loadCourse();
  }, [selectedCourse]);

  const recordActivity = async (payload) => {
    await api.post("/activities", {
      ...payload,
      activityDate: new Date().toISOString()
    });
  };

  const completeLesson = async (lesson) => {
    await api.post("/lessons/complete", {
      lessonId: lesson._id,
      courseId: lesson.courseId,
      timeSpent: lesson.duration,
      activityDate: new Date().toISOString(),
      note: `Completed ${lesson.title}`
    });
    const { data } = await api.get(`/courses/${selectedCourse._id}`);
    setLessons(data.lessons || []);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <SectionCard title="Record Learning Activity">
          <ActivityForm onSubmit={recordActivity} />
        </SectionCard>
        <SectionCard title="Courses">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <button
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className={`rounded-3xl border p-5 text-left transition ${
                  selectedCourse?._id === course._id
                    ? "border-sky-300 bg-sky-50"
                    : "border-slate-200 bg-slate-50 hover:border-sky-200"
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{course.description}</p>
                <p className="mt-3 text-sm text-slate-500">{course.lessonsCount} lessons</p>
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={selectedCourse ? `${selectedCourse.title} Lessons` : "Lessons"}>
          <div className="grid gap-4 lg:grid-cols-2">
            {lessons.map((lesson) => (
              <article key={lesson._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{lesson.title}</h3>
                <p className="mt-2 text-sm text-slate-600">Duration: {lesson.duration} min</p>
                <p className="mt-2 text-sm text-slate-500">Order: {lesson.order}</p>
                <button
                  onClick={() => completeLesson(lesson)}
                  className="mt-4 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Mark Completed
                </button>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
};

export default LessonsPage;
