import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const createActivity = asyncHandler(async (req, res, next) => {
  try {
    let { courseId, lessonId, timeSpent, activityDate, note = "" } = req.body;

    if (courseId && !/^[0-9a-fA-F]{24}$/.test(courseId)) {
      const course = await Course.findOne({ title: courseId });
      if (!course) throw new ApiError(404, `Course "${courseId}" not found`);
      courseId = course._id;
    }
    if (lessonId && !/^[0-9a-fA-F]{24}$/.test(lessonId)) {
      const lesson = await Lesson.findOne({ title: lessonId });
      if (!lesson) throw new ApiError(404, `Lesson "${lessonId}" not found`);
      lessonId = lesson._id;
    }

    const activity = await Activity.create({
      studentId: req.user.id,
      courseId,
      lessonId,
      timeSpent,
      activityDate: activityDate || new Date(),
      note
    });

    res.status(201).json({ activity });
  } catch (error) {
    next(error);
  }
});

export const getActivities = asyncHandler(async (req, res, next) => {
  try {
    const filter = req.user.role === "mentor" ? {} : { studentId: req.user.id };

    const activities = await Activity.find(filter)
      .populate("studentId", "name email role")
      .populate("courseId", "title")
      .populate("lessonId", "title duration")
      .sort({ activityDate: -1 })
      .lean();

    res.json({ activities });
  } catch (error) {
    next(error);
  }
});