import { useEffect, useMemo, useState } from "react";
import { taskApi } from "../services/api";

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

  const handleStart = async (id) => {
    await taskApi.startTask(id);
    fetchTasks();
  };

  const handleEnd = async (id) => {
    await taskApi.endTask(id);
    fetchTasks();
  };

  return (
    <section className="space-y-6">
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
        <p className="mb-4 text-sm text-slate-400">Start and end tasks to generate real behavior data.</p>

        {loading ? <p>Loading tasks...</p> : null}
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
            <p className="text-sm text-slate-400">No tasks planned for today. Add some from Task Manager.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
