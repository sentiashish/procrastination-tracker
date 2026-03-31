import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, CalendarClock, CheckCircle2, TimerReset } from "lucide-react";
import { taskApi } from "../services/api";
import { useToast } from "../context/ToastContext";

const isToday = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatElapsed = (startTime, tick) => {
  void tick;
  const totalSeconds = Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const createTemplateWindow = (durationMinutes) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { plannedStartTime: start.toISOString(), plannedEndTime: end.toISOString() };
};

const DashboardPage = () => {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const [focusOnly, setFocusOnly] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((prev) => prev + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await taskApi.getTasks();
      setTasks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const todayTasks = useMemo(() => tasks.filter((task) => isToday(task.plannedStartTime)), [tasks]);
  const activeTask = useMemo(
    () => todayTasks.find((task) => task.actualStartTime && !task.actualEndTime),
    [todayTasks]
  );

  useEffect(() => {
    localStorage.setItem("pk-active-task", activeTask ? "1" : "0");
  }, [activeTask]);

  const completedToday = todayTasks.filter((task) => task.status === "completed").length;
  const delayedToday = todayTasks.filter((task) => task.status === "delayed").length;

  const momentumMessage = activeTask
    ? "You are in flow. Protect this block and finish strong."
    : completedToday > 0
    ? `Great rhythm today: ${completedToday} task${completedToday > 1 ? "s" : ""} completed. Keep the pace steady.`
    : todayTasks.length > 0
    ? "A calm start wins. Begin with your smallest planned task and build momentum."
    : "Plan one realistic block and execute it. Small wins compound quickly.";

  const completedAllTime = tasks.filter((task) => task.status === "completed").length;
  const successPercent = Math.min(100, Math.round((completedAllTime / 3) * 100));
  const showSuccessBar = completedAllTime < 3;

  const plannedTodaySeconds = todayTasks.reduce(
    (sum, task) => sum + Math.max(0, (new Date(task.plannedEndTime) - new Date(task.plannedStartTime)) / 1000),
    0
  );

  const realizedTodaySeconds = todayTasks.reduce((sum, task) => {
    if (!task.actualStartTime) return sum;
    if (task.actualEndTime) {
      return sum + Math.max(0, (new Date(task.actualEndTime) - new Date(task.actualStartTime)) / 1000);
    }
    return sum + Math.max(0, (Date.now() - new Date(task.actualStartTime).getTime()) / 1000);
  }, 0);

  const pulsePercent =
    plannedTodaySeconds > 0 ? Math.min(100, Math.round((realizedTodaySeconds / plannedTodaySeconds) * 100)) : 0;

  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (pulsePercent / 100) * ringCircumference;

  const applyTaskPatch = (taskId, patch) => {
    setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, ...patch } : task)));
  };

  const handleStart = async (task) => {
    const optimisticStart = new Date().toISOString();
    const optimisticStatus = new Date(optimisticStart) > new Date(task.plannedStartTime) ? "delayed" : task.status;

    applyTaskPatch(task._id, {
      actualStartTime: optimisticStart,
      status: optimisticStatus,
    });
    setFocusOnly(true);

    try {
      await taskApi.startTask(task._id);
      addToast({ type: "success", title: "Task started", message: "Focus mode activated." });
    } catch (err) {
      applyTaskPatch(task._id, { actualStartTime: null, status: "pending" });
      addToast({ type: "error", title: "Could not start task", message: err.response?.data?.message || "Please try again." });
    }
  };

  const handleEnd = async (task) => {
    const optimisticEnd = new Date().toISOString();
    applyTaskPatch(task._id, { actualEndTime: optimisticEnd, status: "completed" });

    try {
      await taskApi.endTask(task._id);
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 1200);
      addToast({ type: "success", title: "Task completed", message: "Nice execution. Keep the streak alive." });
      setFocusOnly(false);
    } catch (err) {
      applyTaskPatch(task._id, { actualEndTime: null, status: task.status });
      addToast({ type: "error", title: "Could not end task", message: err.response?.data?.message || "Please try again." });
    }
  };

  const handleCreateTemplate = async (templateType) => {
    const templateConfig = {
      deep: { title: "Deep Work Session", duration: 90 },
      admin: { title: "Admin Clearing", duration: 45 },
      learning: { title: "Learning Block", duration: 60 },
    }[templateType];

    if (!templateConfig) return;

    const { plannedStartTime, plannedEndTime } = createTemplateWindow(templateConfig.duration);

    try {
      const response = await taskApi.createTask({
        title: templateConfig.title,
        plannedStartTime,
        plannedEndTime,
      });
      setTasks((prev) => [...prev, response.data]);
      addToast({ type: "success", title: "Template added", message: `${templateConfig.title} is scheduled for today.` });
    } catch (err) {
      addToast({ type: "error", title: "Template failed", message: err.response?.data?.message || "Please try again." });
    }
  };

  const FocusCard = (
    <div className="rounded-2xl bg-primary p-6 text-white shadow-xl shadow-primary/40">
      <p className="text-xs uppercase tracking-[0.14em] text-white/80">Current Focus</p>
      <h2 className="heading-premium mt-2 text-2xl">{activeTask?.title || "No active task"}</h2>
      {activeTask ? (
        <>
          <p className="metric-mono mt-2 text-sm text-white/90">
            Running: {formatElapsed(activeTask.actualStartTime, tick)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => handleEnd(activeTask)} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-primary">
              End Session
            </button>
            <button
              onClick={() => setFocusOnly(false)}
              className="rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white"
            >
              Continue in Background
            </button>
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-white/80">Start a task to enter focus mode.</p>
      )}
    </div>
  );

  if (focusOnly && activeTask) {
    return (
      <section className="space-y-4">
        {FocusCard}
        <p className="text-xs text-slate-500">Nice momentum. Finish this block before switching context.</p>
      </section>
    );
  }

  return (
    <section className="relative space-y-6">
      {showConfetti ? (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
          {[...Array(24)].map((_, index) => (
            <span
              key={index}
              className="confetti-piece"
              style={{
                left: `${(index * 13) % 100}%`,
                animationDelay: `${(index % 6) * 40}ms`,
              }}
            />
          ))}
        </div>
      ) : null}

      {showSuccessBar ? (
        <div className="rounded-xl border border-white/10 bg-dashboardDarkAlt px-4 py-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Success Progress</p>
            <p className="metric-mono text-xs text-secondary">{completedAllTime}/3 completed</p>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-secondary transition-all duration-500" style={{ width: `${successPercent}%` }} />
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.12em] text-primary/80">Daily Momentum</p>
        <p className="mt-1 text-sm text-slate-200">{momentumMessage}</p>
      </div>

      {activeTask ? FocusCard : null}

      <motion.div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Today pulse</p>
              <h2 className="heading-premium flex items-center gap-2 font-heading text-2xl text-white">
                <Activity size={20} className="text-primary" /> Time Realized vs Planned
              </h2>
            </div>
            <div className="relative h-28 w-28">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={ringRadius} stroke="rgba(148,163,184,0.2)" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r={ringRadius}
                  stroke="#8B5CF6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="absolute inset-0 grid place-content-center text-center">
                <p className="metric-mono text-lg font-semibold text-white">{pulsePercent}%</p>
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">realized</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-dashboardActive/40 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-400">Tasks</p>
              <CalendarClock size={14} className="mb-1 text-slate-300" />
              <p className="metric-mono mt-1 text-2xl font-semibold text-white">{todayTasks.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-dashboardActive/40 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-400">Completed</p>
              <CheckCircle2 size={14} className="mb-1 text-secondary" />
              <p className="metric-mono mt-1 text-2xl font-semibold text-secondary">{completedToday}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-dashboardActive/40 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-400">Delayed</p>
              <TimerReset size={14} className="mb-1 text-amber-400" />
              <p className="metric-mono mt-1 text-2xl font-semibold text-amber-400">{delayedToday}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-5">
          <h3 className="heading-premium font-heading text-xl text-white">Action loop</h3>
          <p className="mt-1 text-sm text-slate-400">Plan {"->"} Act {"->"} Reflect. Stay steady and let consistency do the heavy lifting.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/tasks" className="btn-primary text-sm">Plan in Task Manager</Link>
            <Link to="/analytics" className="btn-outline text-sm">Reflect in Analytics</Link>
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-4">
        <h2 className="heading-premium font-heading text-xl text-white">Today's Task Flow</h2>
        <p className="mb-4 text-sm text-slate-400">Start when you begin and end when you finish. Clear tracking, clear progress.</p>

        {loading ? (
          <div className="space-y-3">
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
          </div>
        ) : null}
        {error ? <p className="text-red-400">{error}</p> : null}

        <div className="space-y-3">
          {todayTasks.map((task) => (
            <article
              key={task._id}
              className="group rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{task.title}</h3>
                  <p className="metric-mono text-xs text-slate-400">{formatTime(task.plannedStartTime)} - {formatTime(task.plannedEndTime)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">{task.status}</span>
                  {!task.actualStartTime ? (
                    <button
                      onClick={() => handleStart(task)}
                      className="relative overflow-hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10">START EXECUTION</span>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary to-secondary transition-transform duration-300 group-hover:translate-x-0" />
                    </button>
                  ) : null}
                  {task.actualStartTime && !task.actualEndTime ? (
                    <button
                      onClick={() => handleEnd(task)}
                      className="rounded-full bg-secondary px-4 py-2 text-xs font-bold text-slate-900 transition-all hover:scale-105 active:scale-95"
                    >
                      END • {formatElapsed(task.actualStartTime, tick)}
                    </button>
                  ) : null}
                </div>
              </div>
              {task.actualStartTime && !task.actualEndTime ? <div className="mt-3 h-[2px] w-full animate-pulse rounded bg-primary" /> : null}
            </article>
          ))}

          {!loading && todayTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
              <p className="text-base font-semibold text-white">Daily Setup Wizard</p>
              <p className="mt-1 text-sm text-slate-400">Choose a quick template to set your day in under 10 seconds.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button className="btn-primary text-sm" onClick={() => handleCreateTemplate("deep")}>Deep Work Session</button>
                <button className="btn-secondary text-sm" onClick={() => handleCreateTemplate("admin")}>Admin Clearing</button>
                <button className="btn-outline text-sm" onClick={() => handleCreateTemplate("learning")}>Learning Block</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
