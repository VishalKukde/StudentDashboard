import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";
import Activity from "../models/Activity.js";
import connectDB from "../config/db.js";

const firstNames = [
  "Aarav", "Ishita", "Kabir", "Ananya", "Rohan", "Meera", "Vihaan", "Sara", "Arjun", "Naina",
  "Aditya", "Pooja", "Tara", "Karan", "Diya", "Rahul", "Sanjana", "Asha", "Neil", "Kavya"
];

const courseTitles = [
  "React Foundations",
  "Node.js Essentials",
  "MongoDB Mastery",
  "Express API Design",
  "JavaScript for Dashboards",
  "Data Visualization with Recharts",
  "Authentication and Security",
  "MERN Project Architecture",
  "Testing Web Apps",
  "Deployment and Monitoring"
];

const pick = (arr, index) => arr[index % arr.length];

const run = async () => {
  await connectDB();

  console.log("Emptying database...");
  await User.deleteMany({});
  await Course.deleteMany({});
  await Lesson.deleteMany({});
  await Progress.deleteMany({});
  await Activity.deleteMany({});

  const students = Array.from({ length: 20 }).map((_, index) => ({
    name: `${pick(firstNames, index)} Student`,
    email: `student${index + 1}@example.com`,
    password: "Password123!",
    role: "student"
  }));

  const mentors = Array.from({ length: 5 }).map((_, index) => ({
    name: `${pick(firstNames, index + 5)} Mentor`,
    email: `mentor${index + 1}@example.com`,
    password: "Password123!",
    role: "mentor"
  }));

  const users = [...students, ...mentors];
  const createdUsers = await User.create(users);

  const courseData = courseTitles.map((title, index) => ({
    title,
    description: `${title} for progressive student growth and project readiness.`,
    level: index < 3 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced",
    order: index + 1,
    tags: ["mern", "dashboard", "learning"]
  }));
  const createdCourses = await Course.insertMany(courseData);

  const lessons = [];
  for (let courseIndex = 0; courseIndex < createdCourses.length; courseIndex += 1) {
    for (let lessonIndex = 0; lessonIndex < 10; lessonIndex += 1) {
      lessons.push({
        courseId: createdCourses[courseIndex]._id,
        title: `${createdCourses[courseIndex].title} Lesson ${lessonIndex + 1}`,
        duration: 20 + ((lessonIndex + courseIndex) % 25),
        order: lessonIndex + 1,
        content: `Lesson content for ${createdCourses[courseIndex].title} ${lessonIndex + 1}`
      });
    }
  }

  const createdLessons = await Lesson.insertMany(lessons);

  const progressDocs = [];
  const activityDocs = [];

  const createdStudents = createdUsers.filter((user) => user.role === "student");

  createdStudents.forEach((student, studentIndex) => {
    createdLessons.forEach((lesson, lessonIndex) => {
      const completed = (studentIndex + lessonIndex) % 3 !== 0;
      progressDocs.push({
        studentId: student._id,
        courseId: lesson.courseId,
        lessonId: lesson._id,
        completed,
        completedAt: completed ? new Date(Date.now() - (studentIndex + lessonIndex) * 86400000) : null
      });

      if ((studentIndex + lessonIndex) % 2 === 0) {
        activityDocs.push({
          studentId: student._id,
          courseId: lesson.courseId,
          lessonId: lesson._id,
          timeSpent: 15 + ((studentIndex + lessonIndex) % 45),
          activityDate: new Date(Date.now() - ((studentIndex + lessonIndex) % 14) * 86400000),
          note: "Seeded study session"
        });
      }
    });
  });

  await Progress.insertMany(progressDocs);
  await Activity.insertMany(activityDocs);

  console.log(`Seed complete with ${students.length} students, ${mentors.length} mentors, ${createdCourses.length} courses, ${createdLessons.length} lessons, ${activityDocs.length} activities.`);
  await mongoose.connection.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});