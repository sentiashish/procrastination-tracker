const express = require("express");
const { createTask, getTasks, startTask, endTask, updateTask, deleteTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/", protect, getTasks);
router.put("/start/:id", protect, startTask);
router.put("/end/:id", protect, endTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
