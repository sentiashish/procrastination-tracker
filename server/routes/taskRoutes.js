const express = require("express");
const { createTask, getTasks, startTask, endTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/", protect, getTasks);
router.put("/start/:id", protect, startTask);
router.put("/end/:id", protect, endTask);

module.exports = router;
