import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-semibold transition ${
    isActive ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-dashboardDark/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <h1 className="font-heading text-xl text-white">Procrastination Killer</h1>
          <p className="text-xs text-slate-400">Behavior Analytics System</p>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={navClass}>
            Task Manager
          </NavLink>
          <NavLink to="/analytics" className={navClass}>
            Analytics
          </NavLink>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-secondary hover:text-secondary"
          >
            Logout {user?.name ? `(${user.name})` : ""}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
