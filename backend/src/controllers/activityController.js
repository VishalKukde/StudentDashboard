import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const createActivity = asyncHandler(async (req, res) => {
  const { courseId, lessonId, timeSpent, activityDate, note = "" } = req.body;
  const activity = await Activity.create({
    studentId: req.user.id,
    courseId,
    lessonId,
    timeSpent,
    activityDate: activityDate || new Date(),
    note
  });

  res.status(201).json({ activity });
});

export const getActivities = asyncHandler(async (req, res) => {
  const filter = req.user.role === "mentor" ? {} : { studentId: req.user.id };

  const activities = await Activity.find(filter)
    .populate("studentId", "name email role")
    .populate("courseId", "title")
    .populate("lessonId", "title duration")
    .sort({ activityDate: -1 })
    .lean();

  res.json({ activities });
});