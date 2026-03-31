import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  ChevronDown,
  Command,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserCog,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/tasks", label: "Task Manager", icon: ListTodo },
  { to: "/analytics", label: "Insights", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

const DESKTOP_NAV_CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
};

const DESKTOP_NAV_ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

const navItemClass = ({ isActive }) =>
  `group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "border-primary/50 bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30"
      : "border-white/10 text-slate-300 hover:border-primary/30 hover:bg-slate-800/90 hover:text-white"
  }`;

const mobileNavItemClass = ({ isActive }) =>
  `inline-flex min-w-[122px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "border-primary/50 bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/20"
      : "border-white/10 bg-dashboardActive/60 text-slate-200 hover:border-primary/30 hover:text-white"
  }`;

const todayLines = [
  "Small progress still counts. Keep your next block simple.",
  "Protect one focused hour today. Let consistency do the work.",
  "Clarity first, speed second. Start with the next obvious task.",
  "Calm execution beats pressure. Finish one block at a time.",
  "Build momentum, not stress. Start now and refine as you go.",
  "A clean start creates energy. Open one task and begin.",
  "Steady effort compounds. Keep today's commitment realistic.",
];

const getTodayLine = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return todayLines[dayOfYear % todayLines.length];
};

const getInitials = (name = "U") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const isTypingTarget = (target) => {
  const tagName = target?.tagName?.toLowerCase();
  return target?.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select";
};

const AppShell = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const lastShortcutRef = useRef({ key: "", at: 0 });
  const initials = useMemo(() => getInitials(user?.name || "U"), [user?.name]);

  const status = localStorage.getItem("pk-active-task") === "1" ? "In Task" : "Procrastinating";
  const statusColor = status === "In Task" ? "bg-emerald-400" : "bg-amber-400";
  const todayLine = useMemo(() => getTodayLine(), []);

  const commandItems = useMemo(
    () => [
      { label: "Go to Dashboard", hint: "G D", action: () => navigate("/dashboard") },
      { label: "Go to Tasks", hint: "G T", action: () => navigate("/tasks") },
      { label: "Go to Analytics", hint: "G A", action: () => navigate("/analytics") },
      { label: "Create New Task", hint: "N", action: () => navigate("/tasks?new=1") },
      { label: "Open Settings", hint: "S", action: () => navigate("/settings") },
    ],
    [navigate]
  );

  const filteredCommands = commandItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const navigateWithToast = (path, message) => {
      navigate(path);
      addToast({ type: "info", title: "Shortcut", message });
    };

    const onKeyDown = (event) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      const now = Date.now();

      if (key === "n") {
        event.preventDefault();
        navigateWithToast("/tasks?new=1", "Opened Task Manager");
        return;
      }

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      const withinSequence = now - lastShortcutRef.current.at < 1000;
      if (lastShortcutRef.current.key === "g" && withinSequence) {
        const shortcutAction = {
          d: () => navigateWithToast("/dashboard", "Navigated to Dashboard"),
          t: () => navigateWithToast("/tasks", "Navigated to Tasks"),
          a: () => navigateWithToast("/analytics", "Navigated to Analytics"),
        }[key];

        if (shortcutAction) {
          shortcutAction();
        }
      }

      lastShortcutRef.current = { key, at: now };
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addToast, navigate]);

  return (
    <div className="min-h-screen bg-dashboardDark text-slate-100" data-theme-surface={theme}>
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-800 bg-slate-950/70 p-5 lg:block">
          <div
            className={`mb-8 rounded-2xl border px-4 py-3 shadow-lg ${
              theme === "light"
                ? "border-slate-200 bg-white shadow-slate-200/70"
                : "border-white/10 bg-gradient-to-br from-slate-900/95 to-[#0b1530]/95 shadow-black/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`grid h-11 w-11 place-content-center rounded-xl border border-primary/35 ${
                  theme === "light" ? "bg-slate-50" : "bg-slate-950/80"
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M4 18.5H9.4L12 13.9V18.5H15V10.2L18.2 15.9H21L15 5.5H13.2L8.6 13.4H6.2L10.9 5.5H8.8L3 15.6H7.2L4 18.5Z" fill="url(#pkMarkGradient)" />
                  <defs>
                    <linearGradient id="pkMarkGradient" x1="3" y1="5.5" x2="21" y2="18.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold uppercase leading-[1.1] text-white" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.01em" }}>
                  Procrastination Killer
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase leading-[1.2] tracking-[0.14em] text-secondary">
                  Behavior Intelligence Suite
                </p>
              </div>
            </div>
          </div>

          <motion.nav
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={DESKTOP_NAV_CONTAINER_VARIANTS}
          >
            <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">Navigation</p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.to} variants={DESKTOP_NAV_ITEM_VARIANTS}>
                  <NavLink to={item.to} className={navItemClass}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                </motion.div>
              );
            })}
          </motion.nav>

          <div
            className={`mt-8 rounded-2xl border p-4 shadow-lg ${
              theme === "light"
                ? "border-primary/25 bg-primary/5 shadow-slate-200/70"
                : "border-primary/20 bg-gradient-to-br from-slate-900 to-slate-900/70 shadow-primary/10"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-primary/80">Momentum Note</p>
            <p className="mt-2 text-sm text-slate-200">Progress beats intensity. One focused block is enough to move today forward.</p>
            <p className="mt-2 text-xs text-slate-400">If energy dips, shorten the block. Do not break the streak.</p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-white/5 bg-dashboardDark/65 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Workspace</p>
                <h1 className="text-sm font-semibold text-white sm:text-base">Personal Productivity Command Center</h1>
                <p className="mt-1 hidden text-xs text-slate-400 sm:block">Today line: {todayLine}</p>
              </div>

              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden min-w-[280px] items-center justify-between rounded-lg border border-white/10 bg-dashboardActive/70 px-3 py-2 text-sm text-slate-300 hover:border-primary/50 hover:text-white md:flex"
              >
                <span className="flex items-center gap-2">
                  <Search size={14} />
                  Quick task search or jump...
                </span>
                <span className="metric-mono rounded border border-white/10 px-2 py-0.5 text-xs">Cmd/Ctrl + K</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 hover:border-slate-500"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {initials}
                  </span>
                  <span className="hidden text-sm text-slate-200 sm:block">{user?.name || "User"}</span>
                  <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
                  <span className="relative hidden h-2.5 w-2.5 sm:block">
                    <span className={`absolute h-2.5 w-2.5 rounded-full ${statusColor}`} />
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
                    >
                      <div className="rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="truncate text-sm font-semibold text-white">{user?.email || "No email"}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Status: <span className="text-slate-200">{status}</span>
                        </p>
                      </div>
                      <button
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/settings");
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <UserCog size={15} />
                          Profile settings
                        </span>
                      </button>
                      <button
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                        onClick={() => {
                          toggleTheme();
                          setMenuOpen(false);
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                          Switch to {theme === "dark" ? "light" : "dark"} mode
                        </span>
                      </button>
                      <button
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <LogOut size={15} />
                          Sign out
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/45 p-2 lg:hidden">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Quick Navigation</p>
                <span className="metric-mono text-[11px] text-slate-500">Mobile</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setPaletteOpen(true)}
                className="inline-flex min-w-[142px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-dashboardActive/70 px-3 py-2 text-sm font-medium text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <Command size={14} /> Quick Search
                </span>
              </button>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={mobileNavItemClass}>
                    <Icon size={15} />
                    {item.label === "Task Manager" ? "Tasks" : item.label}
                  </NavLink>
                );
              })}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>

      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-start bg-black/60 px-4 pt-24"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ y: -14, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -14, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-dashboardDarkAlt p-3 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search commands..."
                className="input-field mb-2"
              />
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {filteredCommands.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setPaletteOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition-all hover:bg-dashboardActive hover:translate-x-0.5"
                  >
                    <span>{item.label}</span>
                    <span className="metric-mono text-xs text-slate-400">{item.hint}</span>
                  </button>
                ))}
                {filteredCommands.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-slate-400">No command found.</p>
                ) : null}
              </div>
              <div className="mt-2 flex items-center gap-2 px-2 text-xs text-slate-500">
                <Sparkles size={12} />
                Use keyboard to navigate faster.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppShell;
