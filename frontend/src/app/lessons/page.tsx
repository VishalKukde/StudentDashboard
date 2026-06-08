"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { ProtectedPage } from "../../components/ProtectedPage";
import { Layout } from "../../components/Layout";
import { ActivityForm } from "../../components/ActivityForm";
import { SectionCard } from "../../components/SectionCard";
import type { CourseItem, LessonItem } from "../../lib/types";

export default function LessonsPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<{ courses: CourseItem[] }>("/courses");
        setCourses(data.courses);
        if (data.courses.length > 0) {
          setSelectedCourse(data.courses[0]);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    const loadCourse = async () => {
      if (!selectedCourse?._id) return;
      try {
        const { data } = await api.get<{ lessons: LessonItem[] }>(`/courses/${selectedCourse._id}`);
        setLessons(data.lessons || []);
      } catch (err) {
        console.error("Failed to load lessons", err);
        setError("Failed to load lessons for this course.");
      }
    };

    void loadCourse();
  }, [selectedCourse]);

  const recordActivity = async (payload: { courseId: string; lessonId: string; timeSpent: number; note: string }) => {
    try {
      setError("");
      await api.post("/activities", {
        ...payload,
        activityDate: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to record activity", err);
      setError("Failed to save activity. Please try again.");
    }
  };

  const completeLesson = async (lesson: LessonItem) => {
    try {
      setError("");
      await api.post("/lessons/complete", {
        lessonId: lesson._id,
        courseId: lesson.courseId,
        timeSpent: lesson.duration,
        activityDate: new Date().toISOString(),
        note: `Completed ${lesson.title}`
      });

      if (!selectedCourse?._id) return;
      const { data } = await api.get<{ lessons: LessonItem[] }>(`/courses/${selectedCourse._id}`);
      setLessons(data.lessons || []);
    } catch (err) {
      console.error("Failed to complete lesson", err);
      setError("Failed to mark lesson as completed. Please try again.");
    }
  };

  return (
    <ProtectedPage roles={["student", "mentor"]}>
      <Layout>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Lessons</p>
            <h1 className="mt-3 font-[family-name:var(--font-grotesk)] text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Keep each study session visible, structured, and easy to complete.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Record learning activity, mark lessons complete, and switch courses from a clean white workspace with clear, readable controls.
            </p>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid min-h-[20vh] place-items-center text-slate-500">Loading courses...</div>
          ) : (
            <>
              <SectionCard title="Record Learning Activity">
                <ActivityForm onSubmit={recordActivity} courses={courses} initialCourseId={selectedCourse?._id} />
              </SectionCard>

              <SectionCard title="Courses">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <button
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className={`rounded-[1.75rem] border p-5 text-left transition hover:-translate-y-0.5 ${selectedCourse?._id === course._id ? "border-sky-300 bg-sky-50 shadow-[0_12px_30px_rgba(37,99,235,0.08)]" : "border-slate-200 bg-white hover:border-sky-200"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-[family-name:var(--font-grotesk)] text-lg font-semibold text-slate-950">{course.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{course.description}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                          {course.lessonsCount}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title={selectedCourse ? `${selectedCourse.title} Lessons` : "Lessons"}>
                <div className="grid gap-4 lg:grid-cols-2">
                  {lessons.map((lesson) => (
                    <article key={lesson._id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-[family-name:var(--font-grotesk)] text-lg font-semibold text-slate-950">{lesson.title}</h3>
                          <p className="mt-2 text-sm text-slate-600">Duration: {lesson.duration} min</p>
                          <p className="mt-2 text-sm text-slate-500">Order: {lesson.order}</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Ready
                        </span>
                      </div>
                      <button onClick={() => void completeLesson(lesson)} className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700">
                        Mark Completed
                      </button>
                    </article>
                  ))}
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </Layout>
    </ProtectedPage>
  );
}