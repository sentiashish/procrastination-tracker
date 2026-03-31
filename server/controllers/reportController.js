const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const Report = require("../models/Report");
const { getDurationMs, millisecondsToHours, getWeekStart } = require("../utils/time");

const getWeeklyReport = async (req, res, next) => {
  try {
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const tasks = await Task.find({
      userId: req.user._id,
      plannedStartTime: { $gte: weekStart, $lt: weekEnd },
    });

    const activityLogs = await ActivityLog.find({
      userId: req.user._id,
      startTime: { $gte: weekStart, $lt: weekEnd },
    });

    const totalPlannedMs = tasks.reduce(
      (sum, task) => sum + getDurationMs(task.plannedStartTime, task.plannedEndTime),
      0
    );

    const totalActualMs = tasks.reduce(
      (sum, task) => sum + getDurationMs(task.actualStartTime, task.actualEndTime),
      0
    );

    const distractionMs = activityLogs
      .filter((log) => log.activityType !== "study")
      .reduce((sum, log) => sum + getDurationMs(log.startTime, log.endTime), 0);

    const totalPlannedHours = Number(millisecondsToHours(totalPlannedMs).toFixed(2));
    const totalActualHours = Number(millisecondsToHours(totalActualMs).toFixed(2));
    const distractionHours = Number(millisecondsToHours(distractionMs).toFixed(2));

    const efficiencyScore =
      totalPlannedHours > 0
        ? Number(((totalActualHours / totalPlannedHours) * 100).toFixed(2))
        : 0;

    const reportPayload = {
      userId: req.user._id,
      weekStart,
      totalPlannedHours,
      totalActualHours,
      distractionHours,
      efficiencyScore,
    };

    const report = await Report.findOneAndUpdate(
      { userId: req.user._id, weekStart },
      reportPayload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      report,
      taskCount: tasks.length,
      activityCount: activityLogs.length,
      weekStart,
      weekEnd,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeeklyReport,
};
