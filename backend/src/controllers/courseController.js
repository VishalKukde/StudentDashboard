const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { findById, findMany } = require("../store");

const getCourses = asyncHandler(async (_req, res) => {
  const courses = await findMany("courses", () => true);
  const lessons = await findMany("lessons", () => true);
  const lessonsCountMap = lessons.reduce((acc, lesson) => {
    acc[lesson.courseId] = (acc[lesson.courseId] || 0) + 1;
    return acc;
  }, {});

  res.json({
    courses: courses.map((course) => ({
      ...course,
      lessonsCount: lessonsCountMap[course._id] || 0
    }))
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await findById("courses", req.params.id);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const lessons = await findMany("lessons", (lesson) => String(lesson.courseId) === String(req.params.id));
  lessons.sort((a, b) => (a.order || 0) - (b.order || 0));

  res.json({ course, lessons });
});

module.exports = { getCourses, getCourseById };