"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" as "student" | "mentor" });
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await register(form);
      router.push(user.role === "mentor" ? "/mentor" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Get started</p>
          <h1 className="mt-4 font-[family-name:var(--font-grotesk)] text-4xl font-semibold leading-tight text-slate-950">
            Create a clean workspace for progress tracking and mentoring.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Register as a student or mentor, then jump into dashboards, lesson tracking, and adaptive recommendations with a modern white UI.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Secure", "JWT auth"],
              ["Modern", "Light theme"],
              ["Fast", "File-backed data"],
              ["Clear", "Readable inputs"],
            ].map(([top, bottom]) => (
              <div key={top} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-lg font-semibold text-slate-900">{top}</p>
                <p className="mt-1 text-sm text-slate-500">{bottom}</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[2.25rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.12)] sm:p-10">
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-grotesk)] text-2xl font-semibold text-slate-950">Create account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Everything stays visible and easy to scan on white fields.</p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input className={inputClass} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input className={inputClass} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input className={inputClass} type="password" placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <select className={`${inputClass} appearance-none`} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "student" | "mentor" })}>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>

          {error ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] transition hover:bg-slate-700">
            Register
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Already registered? <Link className="font-medium text-sky-700 hover:text-sky-900" href="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}