const asyncHandler = require("express-async-handler");
const { findMany } = require("../store");
const { toCsv } = require("../utils/csv");

const exportProgress = asyncHandler(async (req, res) => {
  const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
  const progress = await findMany("progress", studentId ? (item) => String(item.studentId) === String(studentId) : () => true);
  const courses = await findMany("courses", () => true);
  const lessons = await findMany("lessons", () => true);
  const courseMap = new Map(courses.map((course) => [String(course._id), course]));
  const lessonMap = new Map(lessons.map((lesson) => [String(lesson._id), lesson]));

  const csv = toCsv(
    progress.map((record) => ({
      studentId: record.studentId,
      course: courseMap.get(String(record.courseId))?.title || "",
      lesson: lessonMap.get(String(record.lessonId))?.title || "",
      completed: record.completed,
      completedAt: record.completedAt || ""
    })),
    [
      { key: "studentId", header: "Student ID" },
      { key: "course", header: "Course" },
      { key: "lesson", header: "Lesson" },
      { key: "completed", header: "Completed" },
      { key: "completedAt", header: "Completed At" }
    ]
  );

  res.header("Content-Type", "text/csv");
  res.attachment("course-progress.csv");
  res.send(csv);
});

const exportActivities = asyncHandler(async (req, res) => {
  const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
  const activities = await findMany("activities", studentId ? (item) => String(item.studentId) === String(studentId) : () => true);

  const csv = toCsv(
    activities.map((record) => ({
      studentId: record.studentId,
      courseId: record.courseId,
      lessonId: record.lessonId,
      timeSpent: record.timeSpent,
      activityDate: record.activityDate,
      note: record.note
    })),
    [
      { key: "studentId", header: "Student ID" },
      { key: "courseId", header: "Course ID" },
      { key: "lessonId", header: "Lesson ID" },
      { key: "timeSpent", header: "Time Spent (min)" },
      { key: "activityDate", header: "Activity Date" },
      { key: "note", header: "Note" }
    ]
  );

  res.header("Content-Type", "text/csv");
  res.attachment("activity-history.csv");
  res.send(csv);
});

const exportMentorOverview = asyncHandler(async (_req, res) => {
  const users = await findMany("users", (user) => user.role === "student");
  const progress = await findMany("progress", () => true);
  const activities = await findMany("activities", () => true);
  const lessons = await findMany("lessons", () => true);

  const rows = users.map((student) => {
    const studentProgress = progress.filter((item) => String(item.studentId) === String(student._id));
    const completedLessons = studentProgress.filter((item) => item.completed).length;
    const totalLessons = lessons.length;
    const learningHours = activities
      .filter((item) => String(item.studentId) === String(student._id))
      .reduce((sum, item) => sum + Number(item.timeSpent || 0), 0) / 60;

    return {
      studentId: student._id,
      name: student.name,
      email: student.email,
      completionPercentage: totalLessons ? Number(((completedLessons / totalLessons) * 100).toFixed(2)) : 0,
      learningHours: Number(learningHours.toFixed(2))
    };
  });

  const csv = toCsv(
    rows,
    [
      { key: "studentId", header: "Student ID" },
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "completionPercentage", header: "Completion %" },
      { key: "learningHours", header: "Learning Hours" }
    ]
  );

  res.header("Content-Type", "text/csv");
  res.attachment("mentor-overview.csv");
  res.send(csv);
});

module.exports = { exportProgress, exportActivities, exportMentorOverview };