import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Activity from "../models/Activity.js";

export const getLessonById = asyncHandler(async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).lean();

    if (!lesson) {
      throw new ApiError(404, "Lesson not found");
    }

    const course = await Course.findById(lesson.courseId).select("title description").lean();
    res.json({ lesson: { ...lesson, courseId: course || lesson.courseId } });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new ApiError(400, "Invalid lesson ID format"));
    }
    next(error);
  }
});

export const completeLesson = asyncHandler(async (req, res, next) => {
  try {
    let { lessonId, courseId, timeSpent = 0, activityDate = new Date(), note = "" } = req.body;

    // Resolve IDs from names if needed
    if (courseId && !/^[0-9a-fA-F]{24}$/.test(courseId)) {
      const course = await Course.findOne({ title: courseId });
      if (!course) throw new ApiError(404, `Course "${courseId}" not found`);
      courseId = course._id;
    }
    if (lessonId && !/^[0-9a-fA-F]{24}$/.test(lessonId)) {
      const foundLesson = await Lesson.findOne({ title: lessonId });
      if (!foundLesson) throw new ApiError(404, `Lesson "${lessonId}" not found`);
      lessonId = foundLesson._id;
    }

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
  } catch (error) {
    if (error.name === "CastError") {
      return next(new ApiError(400, "Invalid lesson or course ID format"));
    }
    next(error);
  }
});