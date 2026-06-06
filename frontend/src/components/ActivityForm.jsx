import { useState } from "react";

const ActivityForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ courseId: "", lessonId: "", timeSpent: 30, note: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
    setForm({ courseId: "", lessonId: "", timeSpent: 30, note: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
      <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Course ID" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} />
      <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Lesson ID" value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} />
      <input className="rounded-2xl border border-slate-200 px-4 py-3" type="number" placeholder="Time Spent" value={form.timeSpent} onChange={(e) => setForm({ ...form, timeSpent: Number(e.target.value) })} />
      <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      <button className="rounded-2xl bg-ink-900 px-5 py-3 font-medium text-white md:col-span-2">Save Activity</button>
    </form>
  );
};

export default ActivityForm;
