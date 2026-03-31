import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-primary text-white shadow-lg shadow-primary/30"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const AppShell = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-dashboardDark text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-800 bg-slate-950/70 p-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-sm font-bold text-primary">
              PK
            </div>
            <div>
              <p className="font-heading text-lg text-white">Procrastination Killer</p>
              <p className="text-xs text-slate-400">Behavior Analytics</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavLink to="/dashboard" className={navItemClass}>
              <span>Overview</span>
            </NavLink>
            <NavLink to="/tasks" className={navItemClass}>
              <span>Task Manager</span>
            </NavLink>
            <NavLink to="/analytics" className={navItemClass}>
              <span>Insights</span>
            </NavLink>
          </nav>

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Pro tip</p>
            <p className="mt-2 text-sm text-slate-200">Track start and end times consistently for better weekly scores.</p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-800 bg-dashboardDark/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Workspace</p>
                <h1 className="text-sm font-semibold text-white sm:text-base">Personal Productivity Command Center</h1>
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 hover:border-slate-500"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {initials}
                  </span>
                  <span className="hidden text-sm text-slate-200 sm:block">{user?.name || "User"}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                    <div className="rounded-lg px-3 py-2">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-white">{user?.email || "No email"}</p>
                    </div>
                    <button
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                    >
                      Profile settings (coming soon)
                    </button>
                    <button
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
              <NavLink to="/dashboard" className={navItemClass}>
                Overview
              </NavLink>
              <NavLink to="/tasks" className={navItemClass}>
                Tasks
              </NavLink>
              <NavLink to="/analytics" className={navItemClass}>
                Insights
              </NavLink>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
