import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${isActive ? "bg-sky-500 text-white shadow-glow" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-dashboard text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={user?.role === "mentor" ? "/mentor" : "/dashboard"} className="font-semibold tracking-wide text-white">
            Progressive Student Dashboard
          </Link>
          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 shadow-glow">
            <NavLink className={navLinkClass} to={user?.role === "mentor" ? "/mentor" : "/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink className={navLinkClass} to="/lessons">
              Lessons
            </NavLink>
            <button onClick={handleLogout} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
