import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Bot, Brain, RefreshCw } from 'lucide-react';
import { reportApi, activityApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AnalyticsPage() {
  const [report, setReport] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);
  const [formError, setFormError] = useState('');
  const { addToast } = useToast();

  const [activityType, setActivityType] = useState('youtube');
  const [duration, setDuration] = useState('');
  const activityTypes = ['youtube', 'instagram', 'social media', 'gaming', 'other'];

  useEffect(() => {
    fetchReport();
    fetchActivities();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reportApi.getWeeklyReport();
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weekly report');
      addToast({ type: 'error', title: 'Report load failed', message: err.response?.data?.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await activityApi.getActivities();
      setActivities(response.data || []);
    } catch (err) {
      setActivities([]);
    }
  };

  const handleLogDistraction = async (e) => {
    e.preventDefault();
    setFormError('');

    const durationNum = parseInt(duration);
    if (!duration || durationNum <= 0) {
      setFormError('Duration must be a positive number');
      return;
    }

    try {
      setLoading(true);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + durationNum * 60000);

      await activityApi.addActivity({
        activityType,
        startTime,
        endTime,
      });
      addToast({ type: 'success', title: 'Distraction logged', message: 'Entry added to your behavior timeline.' });

      setActivityType('youtube');
      setDuration('');
      setShowLogForm(false);
      await fetchReport();
      await fetchActivities();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to log activity');
      addToast({ type: 'error', title: 'Could not log activity', message: err.response?.data?.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateReport = async () => {
    await fetchReport();
    addToast({ type: 'info', title: 'Report refreshed', message: 'Weekly analytics updated.' });
  };

  const barChartData = report
    ? [
        {
          name: 'Hours',
          planned: Number((report.totalPlannedHours || 0).toFixed(2)),
          actual: Number((report.totalActualHours || 0).toFixed(2)),
        },
      ]
    : [];

  const distractionBreakdown = activities.reduce((acc, activity) => {
    const existing = acc.find((a) => a.name === activity.activityType);
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);
    const duration = (endTime - startTime) / (1000 * 60 * 60);

    if (existing) {
      existing.value += Math.round(duration * 100) / 100;
    } else {
      acc.push({ name: activity.activityType, value: Math.round(duration * 100) / 100 });
    }
    return acc;
  }, []);

  const PIE_COLORS = ['#FF6B6B', '#FFA500', '#4ECDC4', '#45B7D1', '#96CEB4'];

  const insights = useMemo(() => {
    const efficiency = Math.round(report?.efficiencyScore || 0);
    const after4pm = activities.filter((item) => new Date(item.startTime).getHours() >= 16).length;
    const topActivity = [...distractionBreakdown].sort((a, b) => b.value - a.value)[0];

    const efficiencyNarrative =
      efficiency >= 80
        ? `Your execution is strong at ${efficiency}%. Keep tasks tightly time-boxed to maintain consistency.`
        : efficiency >= 60
        ? `Efficiency is ${efficiency}%. You are close to high-performance range; reduce context switching after each block.`
        : `Efficiency is ${efficiency}%. Start with shorter planned windows and finish one block before adding the next.`;

    const patternNarrative =
      after4pm > 0
        ? `${after4pm} distraction logs happened after 4 PM. Add a protected 45-minute focus block before evening drop-off.`
        : 'No major late-day distraction pattern detected this week. Continue your current evening structure.';

    const topNarrative = topActivity
      ? `${topActivity.name} is your highest distraction source (${topActivity.value.toFixed(2)}h). Set one app-boundary rule for tomorrow.`
      : 'No distraction source has been logged yet. Use Log Distraction for richer coaching insights.';

    return [
      { title: 'Execution Signal', body: efficiencyNarrative },
      { title: 'Timing Pattern', body: patternNarrative },
      { title: 'Primary Trigger', body: topNarrative },
    ];
  }, [activities, distractionBreakdown, report]);

  return (
    <section className="space-y-6">
      <motion.div
        className="rounded-2xl border border-white/10 bg-dashboardDarkAlt p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Behavior Intelligence</p>
            <h1 className="heading-premium mt-1 font-heading text-3xl text-white">Weekly Insights</h1>
            <p className="mt-2 text-sm text-slate-400">Reflect with clear metrics, spot progress, and plan your next steady improvement.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRegenerateReport}
              disabled={loading}
              className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="btn-primary w-full text-sm sm:w-auto"
            >
              {showLogForm ? 'Cancel' : '+ Log Distraction'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {showLogForm && (
          <div className="mb-6 rounded-2xl border border-primary/30 bg-slate-900/70 p-5">
            <h2 className="font-heading text-xl text-white">
              Log Distraction Activity
            </h2>

            {formError && (
              <div className="mb-4 mt-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleLogDistraction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="input-field capitalize"
                  >
                    {activityTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 30"
                    className="input-field"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Logging...' : 'Log Activity'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogForm(false);
                    setActivityType('youtube');
                    setDuration('');
                    setFormError('');
                  }}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && !showLogForm && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="skeleton-shimmer h-28 rounded-xl" />
              <div className="skeleton-shimmer h-28 rounded-xl" />
              <div className="skeleton-shimmer h-28 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="skeleton-shimmer h-80 rounded-xl" />
              <div className="skeleton-shimmer h-80 rounded-xl" />
            </div>
          </div>
        )}

        {report && !loading && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-300">Efficiency Score</span>
                  <Brain size={18} className="text-primary" />
                </div>
                <p className="metric-mono text-3xl font-bold text-primary">
                  {Math.round(report.efficiencyScore || 0)}%
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Actual vs. Planned execution
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-300">Total Hours</span>
                  <Brain size={18} className="text-secondary" />
                </div>
                <div className="mt-2">
                  <p className="metric-mono text-2xl font-bold text-secondary">
                    {(report.totalActualHours || 0).toFixed(2)} hrs
                  </p>
                  <p className="text-sm text-slate-400">
                    Planned: {(report.totalPlannedHours || 0).toFixed(2)} hrs
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-300">Distraction Time</span>
                  <Brain size={18} className="text-rose-400" />
                </div>
                <p className="metric-mono text-3xl font-bold text-rose-400">
                  {(report.distractionHours || 0).toFixed(2)} hrs
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Time spent on non-study activities
                </p>
              </motion.div>
            </div>

            <div className="mb-6 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 to-secondary/10 p-5">
              <h3 className="inline-flex items-center gap-2 font-heading text-lg text-white">
                <Bot size={16} className="text-primary" /> AI Coach Notes
              </h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {insights.map((item) => (
                  <motion.div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-slate-900/45 p-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-200">{item.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
              >
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Planned vs Actual Hours
                </h3>
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                      <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} />
                      <YAxis tick={{ fill: '#cbd5e1' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid rgba(148,163,184,0.35)',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                        }}
                      />
                      <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                      <Bar dataKey="planned" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="actual" fill="#14B8A6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[300px] items-center justify-center rounded bg-slate-950/60">
                    <div className="text-center">
                      <p className="font-semibold text-slate-200">No task data available</p>
                      <p className="text-sm text-slate-400">Complete one task to unlock this chart.</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
              >
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Distraction Breakdown
                </h3>
                {distractionBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distractionBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}h`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distractionBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid rgba(148,163,184,0.35)',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                        }}
                        formatter={(value) => `${value} hours`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[300px] items-center justify-center rounded bg-slate-950/60">
                    <div className="text-center">
                      <p className="font-semibold text-slate-200">No distraction data yet</p>
                      <p className="text-sm text-slate-400">Use Log Distraction to unlock source analysis.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {activities.length > 0 && (
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.06 }}
              >
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Recent Activities
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-slate-300">
                    <thead className="border-b border-white/10 bg-slate-950/60">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Activity</th>
                        <th className="px-4 py-3 text-left font-semibold">Start Time</th>
                        <th className="px-4 py-3 text-left font-semibold">End Time</th>
                        <th className="px-4 py-3 text-left font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => {
                        const duration =
                          (new Date(activity.endTime) - new Date(activity.startTime)) /
                          (1000 * 60);
                        return (
                          <tr key={activity._id} className="border-b border-white/5 hover:bg-slate-800/40">
                            <td className="px-4 py-3 capitalize font-medium text-white">
                              {activity.activityType}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(activity.startTime).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(activity.endTime).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-semibold text-primary">
                              {Math.round(duration)} min
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !report && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 py-12 text-center">
            <p className="text-lg font-semibold text-white">No report data available</p>
            <p className="mt-1 text-slate-400">Complete tasks and log activities to unlock your first progress snapshot.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
