import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const getCourses = asyncHandler(async (_req, res) => {
  const courses = await Course.find().lean();

  // Get lesson counts for each course
  const coursesWithCounts = await Promise.all(
    courses.map(async (course) => {
      const lessonsCount = await Lesson.countDocuments({ courseId: course._id });
      return { ...course, lessonsCount };
    })
  );

  res.json({ courses: coursesWithCounts });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).lean();
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const lessons = await Lesson.find({ courseId: req.params.id }).sort({ order: 1 }).lean();

  res.json({ course, lessons });
});