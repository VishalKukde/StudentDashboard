const asyncHandler = require("express-async-handler");
const { createRecord, findMany } = require("../store");

const createActivity = asyncHandler(async (req, res) => {
  const { courseId, lessonId, timeSpent, activityDate, note = "" } = req.body;
  const activity = await createRecord("activities", {
    studentId: req.user.id,
    courseId,
    lessonId,
    timeSpent,
    activityDate: activityDate || new Date().toISOString(),
    note
  });

  res.status(201).json({ activity });
});

const getActivities = asyncHandler(async (req, res) => {
  const activities = await findMany(
    "activities",
    req.user.role === "mentor" ? () => true : (activity) => String(activity.studentId) === String(req.user.id)
  );

  const users = await findMany("users", () => true);
  const courses = await findMany("courses", () => true);
  const lessons = await findMany("lessons", () => true);

  const userMap = new Map(users.map((user) => [String(user._id), user]));
  const courseMap = new Map(courses.map((course) => [String(course._id), course]));
  const lessonMap = new Map(lessons.map((lesson) => [String(lesson._id), lesson]));

  const enriched = activities
    .slice()
    .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
    .map((activity) => ({
      ...activity,
      studentId: userMap.get(String(activity.studentId))
        ? {
            _id: userMap.get(String(activity.studentId))._id,
            name: userMap.get(String(activity.studentId)).name,
            email: userMap.get(String(activity.studentId)).email,
            role: userMap.get(String(activity.studentId)).role
          }
        : activity.studentId,
      courseId: courseMap.get(String(activity.courseId))
        ? {
            _id: courseMap.get(String(activity.courseId))._id,
            title: courseMap.get(String(activity.courseId)).title
          }
        : activity.courseId,
      lessonId: lessonMap.get(String(activity.lessonId))
        ? {
            _id: lessonMap.get(String(activity.lessonId))._id,
            title: lessonMap.get(String(activity.lessonId)).title,
            duration: lessonMap.get(String(activity.lessonId)).duration
          }
        : activity.lessonId
    }));

  res.json({ activities: enriched });
});

module.exports = { createActivity, getActivities };