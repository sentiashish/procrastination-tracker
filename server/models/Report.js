const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weekStart: {
      type: Date,
      required: true,
      index: true,
    },
    totalPlannedHours: {
      type: Number,
      default: 0,
    },
    totalActualHours: {
      type: Number,
      default: 0,
    },
    distractionHours: {
      type: Number,
      default: 0,
    },
    efficiencyScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

reportSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

module.exports = mongoose.model("Report", reportSchema);
