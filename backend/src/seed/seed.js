require("dotenv").config();
const bcrypt = require("bcryptjs");
const { resetStore, insertMany } = require("../store");

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
  await resetStore();

  const hashedPassword = await bcrypt.hash("Password123!", 12);

  const students = Array.from({ length: 20 }).map((_, index) => ({
    name: `${pick(firstNames, index)} Student`,
    email: `student${index + 1}@example.com`,
    password: hashedPassword,
    role: "student"
  }));

  const mentors = Array.from({ length: 5 }).map((_, index) => ({
    name: `${pick(firstNames, index + 5)} Mentor`,
    email: `mentor${index + 1}@example.com`,
    password: hashedPassword,
    role: "mentor"
  }));

  const users = [...students, ...mentors];
  const createdUsers = await insertMany("users", users);

  const courses = await insertMany(
    "courses",
    courseTitles.map((title, index) => ({
      title,
      description: `${title} for progressive student growth and project readiness.`,
      level: index < 3 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced",
      order: index + 1,
      tags: ["mern", "dashboard", "learning"]
    }))
  );

  const lessons = [];
  for (let courseIndex = 0; courseIndex < courses.length; courseIndex += 1) {
    for (let lessonIndex = 0; lessonIndex < 10; lessonIndex += 1) {
      lessons.push({
        courseId: courses[courseIndex]._id,
        title: `${courses[courseIndex].title} Lesson ${lessonIndex + 1}`,
        duration: 20 + ((lessonIndex + courseIndex) % 25),
        order: lessonIndex + 1,
        content: `Lesson content for ${courses[courseIndex].title} ${lessonIndex + 1}`
      });
    }
  }

  const insertedLessons = await insertMany("lessons", lessons);

  const progressDocs = [];
  const activityDocs = [];

  createdUsers.filter((user) => user.role === "student").forEach((student, studentIndex) => {
    insertedLessons.forEach((lesson, lessonIndex) => {
      const completed = (studentIndex + lessonIndex) % 3 !== 0;
      progressDocs.push({
        studentId: student._id,
        courseId: lesson.courseId,
        lessonId: lesson._id,
        completed,
        completedAt: completed ? new Date(Date.now() - (studentIndex + lessonIndex) * 86400000).toISOString() : null
      });

      if ((studentIndex + lessonIndex) % 2 === 0) {
        activityDocs.push({
          studentId: student._id,
          courseId: lesson.courseId,
          lessonId: lesson._id,
          timeSpent: 15 + ((studentIndex + lessonIndex) % 45),
          activityDate: new Date(Date.now() - ((studentIndex + lessonIndex) % 14) * 86400000).toISOString(),
          note: "Seeded study session"
        });
      }
    });
  });

  await insertMany("progress", progressDocs);
  await insertMany("activities", activityDocs);

  console.log(`Seed complete with ${students.length} students, ${mentors.length} mentors, ${courses.length} courses, ${insertedLessons.length} lessons, ${activityDocs.length} activities.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});