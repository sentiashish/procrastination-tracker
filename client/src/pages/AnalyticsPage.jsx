import { useState, useEffect } from 'react';
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

  // Form state for logging distraction
  const [activityType, setActivityType] = useState('youtube');
  const [duration, setDuration] = useState('');

  // Activity types for distraction logging
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await activityApi.getActivities();
      setActivities(response.data || []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
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
      const endTime = new Date(startTime.getTime() + durationNum * 60000); // Convert minutes to ms

      await activityApi.addActivity({
        activityType,
        startTime,
        endTime,
      });
      addToast({ type: 'success', title: 'Distraction logged', message: 'Entry added to your behavior timeline.' });

      // Reset form and refetch data
      setActivityType('youtube');
      setDuration('');
      setShowLogForm(false);
      await fetchReport();
      await fetchActivities();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to log activity');
      addToast({ type: 'error', title: 'Could not log activity', message: err.response?.data?.message || 'Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateReport = async () => {
    await fetchReport();
    addToast({ type: 'info', title: 'Report refreshed', message: 'Weekly analytics updated.' });
  };

  // Prepare chart data
  const barChartData = report
    ? [
        {
          name: 'Hours',
          planned: (report.totalPlannedHours || 0).toFixed(2),
          actual: (report.totalActualHours || 0).toFixed(2),
        },
      ]
    : [];

  // Calculate distraction breakdown from activities
  const distractionBreakdown = activities.reduce((acc, activity) => {
    const existing = acc.find((a) => a.name === activity.activityType);
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);
    const duration = (endTime - startTime) / (1000 * 60 * 60); // Convert to hours

    if (existing) {
      existing.value += Math.round(duration * 100) / 100;
    } else {
      acc.push({ name: activity.activityType, value: Math.round(duration * 100) / 100 });
    }
    return acc;
  }, []);

  // Color palette for pie chart
  const PIE_COLORS = ['#FF6B6B', '#FFA500', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">
              Weekly Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Track your productivity and distraction patterns
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRegenerateReport}
              disabled={loading}
              className="btn-secondary disabled:opacity-50"
            >
              🔄 Regenerate
            </button>
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="btn-primary w-full sm:w-auto"
            >
              {showLogForm ? 'Cancel' : '+ Log Distraction'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Log Distraction Form */}
        {showLogForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Log Distraction Activity
            </h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleLogDistraction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && !showLogForm && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="skeleton h-28 rounded-xl" />
              <div className="skeleton h-28 rounded-xl" />
              <div className="skeleton h-28 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="skeleton h-80 rounded-xl" />
              <div className="skeleton h-80 rounded-xl" />
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {report && !loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Efficiency Score Card */}
              <div className="card-shadow p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Efficiency Score</span>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#7C3AED' }}>
                  {Math.round(report.efficiencyScore || 0)}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Actual vs. Planned execution
                </p>
              </div>

              {/* Total Hours Card */}
              <div className="card-shadow p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Total Hours</span>
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold" style={{ color: '#14B8A6' }}>
                    {(report.totalActualHours || 0).toFixed(2)} hrs
                  </p>
                  <p className="text-sm text-gray-500">
                    Planned: {(report.totalPlannedHours || 0).toFixed(2)} hrs
                  </p>
                </div>
              </div>

              {/* Distraction Hours Card */}
              <div className="card-shadow p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Distraction Time</span>
                  <span className="text-2xl">🎮</span>
                </div>
                <p className="text-3xl font-bold text-red-500">
                  {(report.distractionHours || 0).toFixed(2)} hrs
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Time spent on non-study activities
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Planned vs Actual Bar Chart */}
              <div className="card-shadow p-6 bg-white border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Planned vs Actual Hours
                </h3>
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFF',
                          border: '2px solid #D1D5DB',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="planned" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="actual" fill="#14B8A6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">📊</div>
                      <p className="text-gray-700 font-semibold">No task data available</p>
                      <p className="text-sm text-gray-500">Complete at least one task to unlock planned vs actual chart.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Distraction Breakdown Pie Chart */}
              <div className="card-shadow p-6 bg-white border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                          backgroundColor: '#FFF',
                          border: '2px solid #D1D5DB',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => `${value} hours`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-xl">🎯</div>
                      <p className="text-gray-700 font-semibold">No distraction data yet</p>
                      <p className="text-sm text-gray-500">Use “Log Distraction” to build your behavior breakdown.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Log Table */}
            {activities.length > 0 && (
              <div className="card-shadow p-6 bg-white border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activities
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead className="border-b-2 border-gray-200 bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Activity</th>
                        <th className="text-left py-3 px-4 font-semibold">Start Time</th>
                        <th className="text-left py-3 px-4 font-semibold">End Time</th>
                        <th className="text-left py-3 px-4 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => {
                        const duration =
                          (new Date(activity.endTime) - new Date(activity.startTime)) /
                          (1000 * 60);
                        return (
                          <tr key={activity._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 capitalize font-medium text-gray-900">
                              {activity.activityType}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(activity.startTime).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(activity.endTime).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-semibold text-purple-600">
                              {Math.round(duration)} min
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !report && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">📈</div>
            <p className="text-gray-700 text-lg font-semibold">No report data available</p>
            <p className="mt-1 text-gray-500">Complete tasks and log activity to generate your first weekly intelligence report.</p>
          </div>
        )}
      </div>
    </div>
  );
}
