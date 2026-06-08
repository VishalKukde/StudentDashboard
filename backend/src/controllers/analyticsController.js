import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Activity from "../models/Activity.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import { getCurrentStreak } from "../utils/streak.js";
import { getRecommendations } from "../utils/recommendations.js";

const toDateString = (date) => {
  try {
    return date ? new Date(date).toISOString().slice(0, 10) : "";
  } catch {
    return "";
  }
};

export const getOverview = asyncHandler(async (req, res, next) => {
  try {
    const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
    const filter = studentId ? { studentId } : {};

    const activities = await Activity.find(filter).lean();
    const progress = await Progress.find(filter).lean();

    const completedLessons = progress.filter((item) => item.completed).length;
    const totalTimeSpent = activities.reduce((sum, item) => sum + Number(item.timeSpent || 0), 0);

    res.json({
      totalCoursesEnrolled: new Set(progress.map((item) => String(item.courseId))).size,
      completedLessons,
      totalTimeSpent,
      currentLearningStreak: getCurrentStreak(activities)
    });
  } catch (error) {
    next(error);
  }
});

export const getProgress = asyncHandler(async (req, res, next) => {
  try {
    const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
    const courses = await Course.find().lean();
    const lessons = await Lesson.find().lean();
    const progress = await Progress.find(studentId ? { studentId } : {}).lean();

    const progressByCourse = courses.map((course) => {
      const courseLessons = lessons.filter((lesson) => String(lesson.courseId) === String(course._id));
      const courseProgress = progress.filter((entry) => String(entry.courseId) === String(course._id));
      const completedLessons = courseProgress.filter((entry) => entry.completed).length;
      const totalLessons = courseLessons.length;

      return {
        _id: course._id,
        courseName: course.title,
        totalLessons,
        completedLessons,
        remainingLessons: Math.max(totalLessons - completedLessons, 0),
        completionPercentage: totalLessons ? (completedLessons / totalLessons) * 100 : 0
      };
    });

    res.json({ progress: progressByCourse.filter((item) => item.totalLessons > 0) });
  } catch (error) {
    next(error);
  }
});

export const getTimeSeries = asyncHandler(async (req, res, next) => {
  try {
    const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
    const range = req.query.range || "7d";
    const limitDays = range === "30d" ? 30 : range === "90d" ? 90 : 7;
    const start = new Date();
    start.setDate(start.getDate() - limitDays + 1);

    const filter = {
      activityDate: { $gte: start }
    };
    if (studentId) filter.studentId = studentId;

    const activities = await Activity.find(filter).lean();
    const buckets = new Map();

    for (const activity of activities) {
      if (!activity.activityDate) continue;
      const day = toDateString(activity.activityDate);
      if (!day) continue;
      const current = buckets.get(day) || { _id: { day }, totalTimeSpent: 0, activities: 0 };
      current.totalTimeSpent += Number(activity.timeSpent || 0);
      current.activities += 1;
      buckets.set(day, current);
    }

    res.json({ range, data: [...buckets.values()].sort((a, b) => a._id.day.localeCompare(b._id.day)) });
  } catch (error) {
    next(error);
  }
});

export const getDistribution = asyncHandler(async (req, res, next) => {
  try {
    const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
    const lessonsCount = await Lesson.countDocuments();
    const progress = await Progress.find(studentId ? { studentId } : {}).lean();

    const completed = progress.filter((item) => item.completed).length;
    const inProgress = progress.filter((item) => !item.completed).length;
    const notStarted = Math.max(lessonsCount - progress.length, 0);

    res.json({
      distribution: [
        { name: "Completed", value: completed },
        { name: "In Progress", value: inProgress },
        { name: "Not Started", value: notStarted }
      ]
    });
  } catch (error) {
    next(error);
  }
});

export const getMentorOverview = asyncHandler(async (_req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).lean();
    const progress = await Progress.find().lean();
    const activities = await Activity.find().lean();
    const lessonsCount = await Lesson.countDocuments();

    const studentRows = students.map((student) => {
      const studentProgress = progress.filter((item) => String(item.studentId) === String(student._id));
      const completedLessons = studentProgress.filter((item) => item.completed).length;
      const totalLessons = lessonsCount;
      const learningHours = activities
        .filter((item) => String(item.studentId) === String(student._id))
        .reduce((sum, item) => sum + Number(item.timeSpent || 0), 0) / 60;
      const lastActivity = activities
        .filter((item) => String(item.studentId) === String(student._id))
        .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())[0]?.activityDate || null;

      return {
        studentId: student._id,
        completionPercentage: totalLessons ? Number(((completedLessons / totalLessons) * 100).toFixed(2)) : 0,
        learningHours: Number(learningHours.toFixed(2)),
        lastActivity
      };
    });

    const averageCompletionPercentage = studentRows.length ? studentRows.reduce((sum, row) => sum + row.completionPercentage, 0) / studentRows.length : 0;
    const averageLearningHours = studentRows.length ? studentRows.reduce((sum, row) => sum + row.learningHours, 0) / studentRows.length : 0;
    const leaderboard = [...studentRows].sort((a, b) => b.completionPercentage - a.completionPercentage || b.learningHours - a.learningHours).slice(0, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const atRiskStudents = studentRows.filter((row) => row.completionPercentage < 20 || !row.lastActivity || new Date(row.lastActivity) < cutoff);

    res.json({
      totalStudents: students.length,
      averageCompletionPercentage: Number(averageCompletionPercentage.toFixed(2)),
      averageLearningHours: Number(averageLearningHours.toFixed(2)),
      leaderboard,
      atRiskStudents
    });
  } catch (error) {
    next(error);
  }
});

export const getRecommendationsForUser = asyncHandler(async (req, res, next) => {
  try {
    const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
    const courses = await Course.find().lean();
    const lessons = await Lesson.find().lean();
    const progress = await Progress.find(studentId ? { studentId } : {}).lean();

    const recommendations = courses.map((course) => {
      const courseLessons = lessons.filter((lesson) => String(lesson.courseId) === String(course._id));
      const courseProgress = progress.filter((item) => String(item.courseId) === String(course._id));
      const completedLessons = courseProgress.filter((item) => item.completed).length;
      const completionPercentage = courseLessons.length ? (completedLessons / courseLessons.length) * 100 : 0;

      return {
        courseId: course._id,
        courseName: course.title,
        completionPercentage: Number(completionPercentage.toFixed(2)),
        suggestions: getRecommendations({ completionRate: completionPercentage, currentCourse: course.title })
      };
    });

    res.json({ recommendations: recommendations.filter((item) => item.completionPercentage > 0 || item.suggestions.length) });
  } catch (error) {
    next(error);
  }
});
