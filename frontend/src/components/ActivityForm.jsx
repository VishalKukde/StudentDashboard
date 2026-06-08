import { useState, useEffect } from "react";
import api from "../api/client";

const ActivityForm = ({ onSubmit, courses = [], initialCourseId = "" }) => {
  const [form, setForm] = useState({ courseId: "", lessonId: "", timeSpent: 30, note: "" });
  const [lessons, setLessons] = useState([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.courseId || !form.lessonId) {
      alert("Please select both a course and a lesson.");
      return;
    }
    onSubmit(form);
    setForm({ ...form, note: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="px-2 text-xs font-semibold text-slate-500 uppercase">Course</label>
        <select
          className="rounded-2xl border border-slate-200 px-4 py-3 bg-white"
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value, lessonId: "" })}
        >
          <option value="">Select a Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="px-2 text-xs font-semibold text-slate-500 uppercase">Lesson</label>
        <select
          className="rounded-2xl border border-slate-200 px-4 py-3 bg-white"
          value={form.lessonId}
          disabled={!form.courseId}
          onChange={(e) => setForm({ ...form, lessonId: e.target.value })}
        >
          <option value="">Select a Lesson</option>
          {lessons.map(lesson => (
            <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="px-2 text-xs font-semibold text-slate-500 uppercase">Time Spent (min)</label>
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3"
          type="number"
          placeholder="Time Spent"
          value={form.timeSpent}
          onChange={(e) => setForm({ ...form, timeSpent: Number(e.target.value) })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="px-2 text-xs font-semibold text-slate-500 uppercase">Notes</label>
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="What did you learn?"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      <button className="rounded-2xl bg-ink-900 px-5 py-4 font-medium text-white md:col-span-2 mt-2 shadow-lg transition hover:bg-ink-800">
        Save Activity
      </button>
    </form>
  );
};

export default ActivityForm;
