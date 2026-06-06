const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { findById, createRecord, upsertOne } = require("../store");

const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await findById("lessons", req.params.id);

  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  const course = await findById("courses", lesson.courseId);
  res.json({ lesson: { ...lesson, courseId: course ? { _id: course._id, title: course.title, description: course.description } : lesson.courseId } });
});

const completeLesson = asyncHandler(async (req, res) => {
  const { lessonId, courseId, timeSpent = 0, activityDate = new Date().toISOString(), note = "" } = req.body;
  const lesson = await findById("lessons", lessonId);

  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  const progress = await upsertOne(
    "progress",
    (item) => String(item.studentId) === String(req.user.id) && String(item.lessonId) === String(lessonId),
    {
      studentId: req.user.id,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date().toISOString()
    }
  );

  const activity = await createRecord("activities", {
    studentId: req.user.id,
    courseId,
    lessonId,
    timeSpent,
    activityDate,
    note
  });

  res.status(200).json({ progress, activity });
});

module.exports = { getLessonById, completeLesson };