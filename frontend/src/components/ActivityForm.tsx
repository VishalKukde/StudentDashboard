"use client";

import { useState } from "react";

type ActivityFormValue = {
  courseId: string;
  lessonId: string;
  timeSpent: number;
  note: string;
};

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export const ActivityForm = ({ onSubmit }: { onSubmit: (value: ActivityFormValue) => Promise<void> | void }) => {
  const [form, setForm] = useState<ActivityFormValue>({ courseId: "", lessonId: "", timeSpent: 30, note: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ courseId: "", lessonId: "", timeSpent: 30, note: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Course ID</label>
        <input className={inputClass} placeholder="Course ID" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Lesson ID</label>
        <input className={inputClass} placeholder="Lesson ID" value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Time Spent</label>
        <input className={inputClass} type="number" placeholder="30" value={form.timeSpent} onChange={(e) => setForm({ ...form, timeSpent: Number(e.target.value) })} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Note</label>
        <input className={inputClass} placeholder="Add a note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </div>
      <button className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)] transition hover:bg-slate-700 md:col-span-2">
        Save Activity
      </button>
    </form>
  );
};