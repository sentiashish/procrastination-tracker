const ActivityLog = require("../models/ActivityLog");

const addActivityLog = async (req, res, next) => {
  try {
    const { activityType, startTime, endTime } = req.body;

    if (!activityType || !startTime || !endTime) {
      res.status(400);
      throw new Error("Activity type, start time, and end time are required");
    }

    if (new Date(endTime) <= new Date(startTime)) {
      res.status(400);
      throw new Error("End time must be after start time");
    }

    const activityLog = await ActivityLog.create({
      userId: req.user._id,
      activityType,
      startTime,
      endTime,
    });

    res.status(201).json(activityLog);
  } catch (error) {
    next(error);
  }
};

const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user._id }).sort({ startTime: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addActivityLog,
  getActivityLogs,
};
