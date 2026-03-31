import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-primary text-white shadow-lg shadow-primary/30"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-dashboardDark/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
              PK
            </div>
            <div>
              <h1 className="font-heading text-xl text-white">Procrastination Killer</h1>
              <p className="text-xs text-slate-400">Behavior Analytics System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 md:block">
              Logged in as <span className="font-semibold text-white">{user?.name || "User"}</span>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={navClass}>
            Tasks
          </NavLink>
          <NavLink to="/analytics" className={navClass}>
            Analytics
          </NavLink>
          <NavLink
            to="/tasks"
            className="ml-auto rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-slate-900 hover:brightness-110"
          >
            + New Task
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
