const express = require("express");
const { addActivityLog, getActivityLogs } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addActivityLog);
router.get("/", protect, getActivityLogs);

module.exports = router;
