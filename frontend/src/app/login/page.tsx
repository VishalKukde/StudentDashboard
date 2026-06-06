"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "student1@example.com", password: "Password123!" });
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await login(form);
      router.push(user.role === "mentor" ? "/mentor" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-10">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">Progressive learning analytics</p>
            <h1 className="mt-4 font-[family-name:var(--font-grotesk)] text-4xl font-semibold leading-tight sm:text-5xl">
              A cleaner dashboard for student progress, mentor insight, and learning momentum.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
              Sign in to track course completion, review streaks, manage lessons, and follow personalized recommendations in one focused workspace.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Live", "Analytics"],
              ["White", "Inputs"],
              ["Role", "Protected"],
            ].map(([top, bottom]) => (
              <div key={top} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-semibold text-white">{top}</p>
                <p className="mt-1 text-sm text-slate-300">{bottom}</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[2.25rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.12)] sm:p-10">
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-grotesk)] text-2xl font-semibold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Use your email and password to continue.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input className={inputClass} placeholder="student1@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input className={inputClass} type="password" placeholder="Password123!" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          {error ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] transition hover:bg-slate-700">
            Login
          </button>

          <p className="mt-4 text-sm text-slate-500">
            New here? <Link className="font-medium text-sky-700 hover:text-sky-900" href="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}