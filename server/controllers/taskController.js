const Task = require("../models/Task");

const createTask = async (req, res, next) => {
  try {
    const { title, plannedStartTime, plannedEndTime } = req.body;

    if (!title || !plannedStartTime || !plannedEndTime) {
      res.status(400);
      throw new Error("Title, planned start time, and planned end time are required");
    }

    if (new Date(plannedEndTime) <= new Date(plannedStartTime)) {
      res.status(400);
      throw new Error("Planned end time must be after planned start time");
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      plannedStartTime,
      plannedEndTime,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ plannedStartTime: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const startTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.actualStartTime) {
      res.status(400);
      throw new Error("Task already started");
    }

    task.actualStartTime = new Date();
    if (task.actualStartTime > task.plannedStartTime) {
      task.status = "delayed";
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const endTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (!task.actualStartTime) {
      res.status(400);
      throw new Error("Task has not been started yet");
    }

    if (task.actualEndTime) {
      res.status(400);
      throw new Error("Task already ended");
    }

    task.actualEndTime = new Date();
    task.status = "completed";

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, plannedStartTime, plannedEndTime } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    // Allow editing only if task hasn't started
    if (task.actualStartTime) {
      res.status(400);
      throw new Error("Cannot edit a task that has already started");
    }

    // Validate dates if provided
    if (plannedStartTime && plannedEndTime) {
      if (new Date(plannedEndTime) <= new Date(plannedStartTime)) {
        res.status(400);
        throw new Error("Planned end time must be after planned start time");
      }
    }

    // Update fields
    if (title) task.title = title;
    if (plannedStartTime) task.plannedStartTime = plannedStartTime;
    if (plannedEndTime) task.plannedEndTime = plannedEndTime;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    // Only allow deleting pending tasks
    if (task.status !== "pending") {
      res.status(400);
      throw new Error("Can only delete pending tasks");
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  startTask,
  endTask,
  updateTask,
  deleteTask,
};
