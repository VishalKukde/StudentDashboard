import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create account");
    }
  };

  return (
    <div className="min-h-screen bg-dashboard px-4 py-12 text-white">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <h1 className="text-3xl font-semibold">Create account</h1>
        <div className="mt-6 grid gap-4">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
        {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <button className="mt-6 w-full rounded-2xl bg-ink-900 px-4 py-3 font-medium text-white">Register</button>
        <p className="mt-4 text-sm text-slate-500">Already registered? <Link className="text-sky-600" to="/login">Sign in</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;
