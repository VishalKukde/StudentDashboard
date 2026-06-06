const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
    timeSpent: { type: Number, required: true, min: 1 },
    activityDate: { type: Date, default: Date.now, index: true },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
