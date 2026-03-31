import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, PencilLine, Plus, Trash2 } from "lucide-react";
import { taskApi } from "../services/api";
import { useToast } from "../context/ToastContext";

const isToday = (iso) => {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const toInputValue = (iso) => new Date(iso).toISOString().slice(0, 16);
const formatWindow = (startIso, endIso) =>
  `${new Date(startIso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(
    endIso
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [plannedStartTime, setPlannedStartTime] = useState("");
  const [plannedEndTime, setPlannedEndTime] = useState("");
  const [formError, setFormError] = useState("");
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await taskApi.getTasks();
      setTasks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPlannedStartTime("");
    setPlannedEndTime("");
    setEditingId(null);
    setFormError("");
    setShowForm(false);
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Task title is required.");
      return;
    }
    if (!plannedStartTime || !plannedEndTime) {
      setFormError("Please set both start and end times.");
      return;
    }
    if (new Date(plannedStartTime) >= new Date(plannedEndTime)) {
      setFormError("End time must be after start time.");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        const response = await taskApi.updateTask(editingId, {
          title,
          plannedStartTime,
          plannedEndTime,
        });
        setTasks((prev) => prev.map((task) => (task._id === editingId ? { ...task, ...response.data } : task)));
        addToast({ type: "success", title: "Task updated", message: "Schedule updated successfully." });
      } else {
        const response = await taskApi.createTask({ title, plannedStartTime, plannedEndTime });
        setTasks((prev) => [...prev, response.data]);
        addToast({ type: "success", title: "Task created", message: "Added to your planning board." });
      }
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save task");
      addToast({ type: "error", title: "Save failed", message: err.response?.data?.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setPlannedStartTime(toInputValue(task.plannedStartTime));
    setPlannedEndTime(toInputValue(task.plannedEndTime));
    setFormError("");
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId, status) => {
    if (status !== "pending") {
      setError("Only pending tasks can be deleted.");
      return;
    }
    if (!window.confirm("Delete this pending task?")) return;
    try {
      setLoading(true);
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      addToast({ type: "success", title: "Task deleted", message: "Removed from board." });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
      addToast({ type: "error", title: "Delete failed", message: err.response?.data?.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    const durationMap = { deep: 90, revision: 60, admin: 40 };
    const titleMap = {
      deep: "Deep Work Session",
      revision: "Revision Sprint",
      admin: "Admin Cleanup",
    };
    const plannedEnd = new Date(start.getTime() + durationMap[template] * 60 * 1000);

    try {
      const response = await taskApi.createTask({
        title: titleMap[template],
        plannedStartTime: start.toISOString(),
        plannedEndTime: plannedEnd.toISOString(),
      });
      setTasks((prev) => [...prev, response.data]);
      addToast({ type: "success", title: "Template added", message: `${titleMap[template]} added to schedule.` });
    } catch (err) {
      addToast({ type: "error", title: "Template failed", message: err.response?.data?.message || "Please try again." });
    }
  };

  const todayTasks = useMemo(() => tasks.filter((task) => isToday(task.plannedStartTime)), [tasks]);
  const backlogTasks = useMemo(
    () => tasks.filter((task) => task.status === "pending" && !isToday(task.plannedStartTime)),
    [tasks]
  );
  const doneCount = tasks.filter((task) => task.status === "completed").length;
  const delayedCount = tasks.filter((task) => task.status === "delayed").length;

  const taskCard = (task) => (
    <motion.article
      key={task._id}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{task.title}</p>
          <p className="metric-mono mt-1 text-xs text-slate-400">{formatWindow(task.plannedStartTime, task.plannedEndTime)}</p>
        </div>
        <span className="rounded-md bg-dashboardActive px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-slate-300">
          {task.status}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => handleEditTask(task)} className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-slate-900">
          <PencilLine size={12} /> Edit
        </button>
        <button
          onClick={() => handleDeleteTask(task._id, task.status)}
          disabled={task.status !== "pending"}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs font-semibold text-rose-300 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </motion.article>
  );

  return (
    <section className="space-y-6">
      <motion.div
        className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Task Planning Board</p>
            <h1 className="heading-premium mt-1 font-heading text-3xl text-white">Backlog to Today's Schedule</h1>
            <p className="mt-2 text-sm text-slate-400">Turn your backlog into clear execution blocks. Keep it simple and keep it moving.</p>
          </div>
          <button onClick={() => setShowForm((prev) => !prev)} className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus size={15} /> {showForm ? "Close" : "New Task"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-dashboardActive/40 p-3">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Backlog</p>
            <p className="metric-mono text-2xl font-semibold text-white">{backlogTasks.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-dashboardActive/40 p-3">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Done</p>
            <p className="metric-mono text-2xl font-semibold text-secondary">{doneCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-dashboardActive/40 p-3">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Delayed</p>
            <p className="metric-mono text-2xl font-semibold text-amber-400">{delayedCount}</p>
          </div>
        </div>
      </motion.div>

      {showForm ? (
        <motion.div
          className="rounded-2xl border border-primary/30 bg-slate-900/70 p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <h2 className="font-heading text-xl text-white">{editingId ? "Edit Task" : "Create New Task"}</h2>
          {formError ? <p className="mt-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{formError}</p> : null}
          <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="input-field"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="datetime-local"
                value={plannedStartTime}
                onChange={(event) => setPlannedStartTime(event.target.value)}
                className="input-field"
                required
              />
              <input
                type="datetime-local"
                value={plannedEndTime}
                onChange={(event) => setPlannedEndTime(event.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-60">
                {loading ? "Saving..." : editingId ? "Update Task" : "Create Task"}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm">
                Cancel
              </button>
              <button type="button" onClick={() => createTemplate("deep")} className="btn-secondary text-sm">
                Quick Deep Work
              </button>
            </div>
          </form>
        </motion.div>
      ) : null}

      {error ? <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div
          className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.03 }}
        >
          <h3 className="inline-flex items-center gap-2 font-heading text-lg text-white">
            <CalendarDays size={16} className="text-primary" /> Backlog
          </h3>
          <p className="mb-3 mt-1 text-sm text-slate-400">Tasks waiting for their turn. Pick a few and make them real today.</p>
          <div className="space-y-3">
            {loading ? (
              <>
                <div className="skeleton-shimmer h-20 rounded-xl" />
                <div className="skeleton-shimmer h-20 rounded-xl" />
              </>
            ) : backlogTasks.length > 0 ? (
              backlogTasks.map(taskCard)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">Backlog is clear. Great discipline. Add your next high-impact task.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.08 }}
        >
          <h3 className="inline-flex items-center gap-2 font-heading text-lg text-white">
            <CalendarDays size={16} className="text-secondary" /> Today Schedule
          </h3>
          <p className="mb-3 mt-1 text-sm text-slate-400">Your action list for today. Start one block and build momentum.</p>
          <div className="space-y-3">
            {loading ? (
              <>
                <div className="skeleton-shimmer h-20 rounded-xl" />
                <div className="skeleton-shimmer h-20 rounded-xl" />
              </>
            ) : todayTasks.length > 0 ? (
              todayTasks.map(taskCard)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">No tasks in today's schedule yet. Add one simple block and begin.</div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
