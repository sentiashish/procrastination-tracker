import { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed, delayed
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [plannedStartTime, setPlannedStartTime] = useState('');
  const [plannedEndTime, setPlannedEndTime] = useState('');
  const [formError, setFormError] = useState('');
  const { addToast } = useToast();

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskApi.getTasks();
      setTasks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Task title is required');
      return;
    }

    if (!plannedStartTime || !plannedEndTime) {
      setFormError('Please set both start and end times');
      return;
    }

    if (new Date(plannedStartTime) >= new Date(plannedEndTime)) {
      setFormError('End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (editingId) {
        // Update existing task
        response = await taskApi.updateTask(editingId, {
          title,
          plannedStartTime,
          plannedEndTime,
        });
        setTasks(
          tasks.map((t) =>
            t._id === editingId ? { ...t, ...response.data } : t
          )
        );
        addToast({ type: 'success', title: 'Task updated', message: 'Changes saved successfully.' });
      } else {
        // Create new task
        response = await taskApi.createTask({
          title,
          plannedStartTime,
          plannedEndTime,
        });
        setTasks([...tasks, response.data]);
        addToast({ type: 'success', title: 'Task created', message: 'Your task is now ready to track.' });
      }

      // Reset form
      setTitle('');
      setPlannedStartTime('');
      setPlannedEndTime('');
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Failed to save task'
      );
      addToast({ type: 'error', title: 'Could not save task', message: err.response?.data?.message || 'Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setPlannedStartTime(task.plannedStartTime.slice(0, 16)); // Format for datetime input
    setPlannedEndTime(task.plannedEndTime.slice(0, 16));
    setShowForm(true);
    setFormError('');
  };

  const handleDeleteTask = async (taskId, status) => {
    // Only allow delete for pending tasks
    if (status !== 'pending') {
      setError('Can only delete pending tasks');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
      addToast({ type: 'success', title: 'Task removed', message: 'Pending task deleted.' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      addToast({ type: 'error', title: 'Delete failed', message: err.response?.data?.message || 'Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setPlannedStartTime('');
    setPlannedEndTime('');
    setFormError('');
  };

  // Filter tasks
  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === filter);

  // Status badge color mapping
  const statusColors = {
    pending: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delayed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">
              Task Manager
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your tasks and track execution
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary w-full sm:w-auto"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Task' : 'Create New Task'}
            </h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Complete project report"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planned Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={plannedStartTime}
                    onChange={(e) => setPlannedStartTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planned End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={plannedEndTime}
                    onChange={(e) => setPlannedEndTime(e.target.value)}
                    className="input-field"
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
                  {loading ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'completed', 'delayed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 capitalize ${
                filter === status
                  ? 'text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={
                filter === status ? { backgroundColor: '#7C3AED' } : {}
              }
            >
              {status === 'all' ? 'All Tasks' : status}
              {` (${tasks.filter((t) =>
                status === 'all' ? true : t.status === status
              ).length})`}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {loading && !showForm ? (
          <div className="space-y-4 py-2">
            <div className="skeleton h-28 w-full rounded-xl" />
            <div className="skeleton h-28 w-full rounded-xl" />
            <div className="skeleton h-28 w-full rounded-xl" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">📝</div>
            <p className="text-gray-700 text-lg font-semibold">
              {tasks.length === 0
                ? 'No tasks yet. Create one to get started!'
                : `No ${filter} tasks found.`}
            </p>
            <p className="mt-1 text-sm text-gray-500">Create focused tasks with clear time blocks for best analytics.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="card-shadow p-6 bg-white border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                          statusColors[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Planned Start:</span>{' '}
                        {new Date(task.plannedStartTime).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Planned End:</span>{' '}
                        {new Date(task.plannedEndTime).toLocaleString()}
                      </div>
                      {task.actualStartTime && (
                        <div>
                          <span className="font-medium">Actual Start:</span>{' '}
                          {new Date(task.actualStartTime).toLocaleString()}
                        </div>
                      )}
                      {task.actualEndTime && (
                        <div>
                          <span className="font-medium">Actual End:</span>{' '}
                          {new Date(task.actualEndTime).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="flex-1 sm:flex-none btn-secondary text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id, task.status)}
                      disabled={task.status !== 'pending'}
                      title={
                        task.status !== 'pending'
                          ? 'Can only delete pending tasks'
                          : 'Delete this task'
                      }
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                        task.status !== 'pending'
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-50'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
