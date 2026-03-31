import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-dashboardDarkAlt p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-secondary">Account</p>
        <h2 className="mt-2 font-heading text-2xl text-white">Profile & Settings</h2>
        <p className="mt-2 text-sm text-slate-400">Manage your account preferences and workspace experience.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-dashboardDarkAlt p-6">
          <h3 className="text-lg font-semibold text-white">Profile</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
              <p className="text-xs text-slate-400">Full name</p>
              <p className="text-sm font-medium text-white">{user?.name || "-"}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-white">{user?.email || "-"}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-dashboardDarkAlt p-6">
          <h3 className="text-lg font-semibold text-white">Appearance</h3>
          <p className="mt-2 text-sm text-slate-400">Switch between dark and light modes. Preference is saved automatically.</p>
          <button
            onClick={toggleTheme}
            className="mt-4 rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-secondary hover:text-secondary"
          >
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </button>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-800 bg-dashboardDarkAlt p-6">
        <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">N: New task</div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">G D: Go dashboard</div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">G T: Go tasks</div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">G A: Go analytics</div>
        </div>
      </article>
    </section>
  );
};

export default SettingsPage;
