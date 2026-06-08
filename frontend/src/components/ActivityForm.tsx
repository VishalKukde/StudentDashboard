"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";

type ActivityFormValue = {
  courseId: string;
  lessonId: string;
  timeSpent: number;
  note: string;
};

type Course = {
  _id: string;
  title: string;
};

type Lesson = {
  _id: string;
  title: string;
};

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export const ActivityForm = ({
  onSubmit,
  courses = [],
  initialCourseId = ""
}: {
  onSubmit: (value: ActivityFormValue) => Promise<void> | void;
  courses?: Course[];
  initialCourseId?: string;
}) => {
  const [form, setForm] = useState<ActivityFormValue>({ courseId: "", lessonId: "", timeSpent: 30, note: "" });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [internalCourses, setInternalCourses] = useState<Course[]>([]);

  const allCourses = courses.length > 0 ? courses : internalCourses;

  useEffect(() => {
    if (courses.length === 0) {
      const fetchCourses = async () => {
        try {
          const { data } = await api.get<{ courses: Course[] }>("/courses");
          setInternalCourses(data.courses);
        } catch (err) {
          console.error("Failed to fetch courses", err);
        }
      };
      void fetchCourses();
    }
  }, [courses]);

  useEffect(() => {
    if (initialCourseId && !form.courseId) {
      setForm(prev => ({ ...prev, courseId: initialCourseId }));
    }
  }, [initialCourseId]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!form.courseId) {
        setLessons([]);
        return;
      }
      try {
        const { data } = await api.get(`/courses/${form.courseId}`);
        setLessons(data.lessons || []);
        if (data.lessons?.length) {
          setForm(prev => ({ ...prev, lessonId: data.lessons[0]._id }));
        }
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };

    fetchLessons();
  }, [form.courseId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.courseId || !form.lessonId) {
      alert("Please select both a course and a lesson.");
      return;
    }
    await onSubmit(form);
    setForm({ ...form, note: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 capitalize">Course Name</label>
        <select
          className={inputClass}
          value={allCourses.find(c => c._id === form.courseId)?.title || ""}
          onChange={(e) => {
            const course = allCourses.find(c => c.title === e.target.value);
            setForm({ ...form, courseId: course?._id || "", lessonId: "" });
          }}
        >
          <option value="">Select a Course</option>
          {allCourses.map(course => (
            <option key={course._id} value={course.title}>{course.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 capitalize">Lesson Title</label>
        <select
          className={inputClass}
          value={lessons.find(l => l._id === form.lessonId)?.title || ""}
          disabled={!form.courseId}
          onChange={(e) => {
            const lesson = lessons.find(l => l.title === e.target.value);
            setForm({ ...form, lessonId: lesson?._id || "" });
          }}
        >
          <option value="">Select a Lesson</option>
          {lessons.map(lesson => (
            <option key={lesson._id} value={lesson.title}>{lesson.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 capitalize">Time Spent (min)</label>
        <input
          className={inputClass}
          type="number"
          placeholder="30"
          value={form.timeSpent}
          onChange={(e) => setForm({ ...form, timeSpent: Number(e.target.value) })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 capitalize">Note</label>
        <input
          className={inputClass}
          placeholder="What did you learn?"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      <button className="rounded-2xl bg-slate-900 px-5 py-4 font-medium text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)] transition hover:bg-slate-700 md:col-span-2 mt-2">
        Save Activity
      </button>
    </form>
  );
};