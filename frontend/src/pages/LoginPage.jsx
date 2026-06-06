import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "student1@example.com", password: "Password123!" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === "mentor" ? "/mentor" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to sign in");
    }
  };

  return (
    <div className="min-h-screen bg-dashboard px-4 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <section className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-glow backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-100">Progressive learning analytics</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Track progress, coach smarter, and surface the next best lesson.</h1>
          <p className="mt-4 text-slate-300">Secure student and mentor access, course analytics, streaks, recommendations, and CSV exports in one dashboard.</p>
        </section>
        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-8 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Use your email and password to continue.</p>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <button className="mt-6 w-full rounded-2xl bg-ink-900 px-4 py-3 font-medium text-white">Login</button>
          <p className="mt-4 text-sm text-slate-500">New here? <Link className="text-sky-600" to="/register">Create an account</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
