import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Activity from "../models/Activity.js";

export const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).lean();

  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  const course = await Course.findById(lesson.courseId).select("title description").lean();
  res.json({ lesson: { ...lesson, courseId: course || lesson.courseId } });
});

export const completeLesson = asyncHandler(async (req, res) => {
  const { lessonId, courseId, timeSpent = 0, activityDate = new Date(), note = "" } = req.body;
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  const progress = await Progress.findOneAndUpdate(
    { studentId: req.user.id, lessonId },
    {
      studentId: req.user.id,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date()
    },
    { upsert: true, new: true }
  );

  const activity = await Activity.create({
    studentId: req.user.id,
    courseId,
    lessonId,
    timeSpent,
    activityDate,
    note
  });

  res.status(200).json({ progress, activity });
});