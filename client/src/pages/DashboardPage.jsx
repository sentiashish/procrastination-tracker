import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { taskApi } from "../services/api";
import { useToast } from "../context/ToastContext";

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const isToday = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToast } = useToast();

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getTasks();
      setTasks(res.data);
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

  const completedToday = todayTasks.filter((task) => task.status === "completed").length;
  const delayedToday = todayTasks.filter((task) => task.status === "delayed").length;

  const checklist = useMemo(() => {
    const hasTask = tasks.length > 0;
    const hasStarted = tasks.some((task) => Boolean(task.actualStartTime));
    const hasCompleted = tasks.some((task) => task.status === "completed");
    return [
      { label: "Create your first task", done: hasTask },
      { label: "Start at least one task", done: hasStarted },
      { label: "Complete at least one task", done: hasCompleted },
    ];
  }, [tasks]);

  const progressPercent = Math.round(
    (checklist.filter((item) => item.done).length / checklist.length) * 100
  );

  const handleStart = async (id) => {
    try {
      await taskApi.startTask(id);
      addToast({ type: "success", title: "Task started", message: "Execution tracking is now active." });
      fetchTasks();
    } catch (err) {
      addToast({ type: "error", title: "Could not start task", message: err.response?.data?.message || "Please try again." });
    }
  };

  const handleEnd = async (id) => {
    try {
      await taskApi.endTask(id);
      addToast({ type: "success", title: "Task completed", message: "Great job. Your weekly score just got smarter." });
      fetchTasks();
    } catch (err) {
      addToast({ type: "error", title: "Could not end task", message: err.response?.data?.message || "Please try again." });
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-dashboardDarkAlt p-5">
        <h2 className="font-heading text-xl text-white">New here? Follow this quick start</h2>
        <p className="mt-1 text-sm text-slate-400">
          This product helps you close the gap between planning and execution. Follow this flow to see value fast.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Onboarding checklist</p>
            <p className="text-sm font-semibold text-secondary">{progressPercent}%</p>
          </div>
          <div className="mb-3 h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-secondary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${item.done ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>
                  {item.done ? "✓" : "•"}
                </span>
                <span className={item.done ? "text-slate-200" : "text-slate-400"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/tasks"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            1. Create your first task
          </Link>
          <Link
            to="/analytics"
            className="rounded-lg border border-secondary px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/10"
          >
            2. Check your weekly report
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-dashboardDarkAlt p-4">
          <p className="text-sm text-slate-400">Today's Tasks</p>
          <p className="mt-1 text-3xl font-bold text-white">{todayTasks.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-dashboardDarkAlt p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <p className="mt-1 text-3xl font-bold text-secondary">{completedToday}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-dashboardDarkAlt p-4">
          <p className="text-sm text-slate-400">Delayed</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">{delayedToday}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-dashboardDarkAlt p-4">
        <h2 className="font-heading text-xl text-white">Today's Task Flow</h2>
        <p className="mb-4 text-sm text-slate-400">
          Start tasks when work begins and end them when done. This creates clean data for your analytics.
        </p>

        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-16 w-full rounded-lg" />
            <div className="skeleton h-16 w-full rounded-lg" />
            <div className="skeleton h-16 w-full rounded-lg" />
          </div>
        ) : null}
        {error ? <p className="text-red-400">{error}</p> : null}

        <div className="space-y-3">
          {todayTasks.map((task) => (
            <article key={task._id} className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white">{task.title}</h3>
                  <p className="text-xs text-slate-400">
                    {formatTime(task.plannedStartTime)} - {formatTime(task.plannedEndTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
                    {task.status}
                  </span>
                  {!task.actualStartTime ? (
                    <button
                      onClick={() => handleStart(task._id)}
                      className="rounded bg-primary px-3 py-1 text-xs font-semibold"
                    >
                      Start
                    </button>
                  ) : null}
                  {task.actualStartTime && !task.actualEndTime ? (
                    <button
                      onClick={() => handleEnd(task._id)}
                      className="rounded bg-secondary px-3 py-1 text-xs font-semibold text-slate-900"
                    >
                      End
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}

          {!loading && todayTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-2xl">📅</div>
              <p className="text-base font-semibold text-white">No tasks planned for today</p>
              <p className="mt-1 text-sm text-slate-400">Create your first task and start building your execution pattern.</p>
              <Link
                to="/tasks"
                className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                Go to Task Manager
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
