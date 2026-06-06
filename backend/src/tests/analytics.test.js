const request = require("supertest");
const bcrypt = require("bcryptjs");
const { app } = require("../server");
const { resetStore, createRecord } = require("../store");
const { signToken } = require("../utils/jwt");

let token;

beforeEach(async () => {
  process.env.JWT_SECRET = "test-secret";
  await resetStore();

  const student = await createRecord("users", {
    name: "Student One",
    email: "student1@test.com",
    password: await bcrypt.hash("Password123!", 12),
    role: "student"
  });
  const course = await createRecord("courses", { title: "React", description: "React course" });
  const lesson = await createRecord("lessons", { courseId: course._id, title: "Intro", duration: 30 });
  await createRecord("progress", { studentId: student._id, courseId: course._id, lessonId: lesson._id, completed: true, completedAt: new Date().toISOString() });
  await createRecord("activities", { studentId: student._id, courseId: course._id, lessonId: lesson._id, timeSpent: 45, activityDate: new Date().toISOString() });
  token = signToken({ id: student._id, role: student.role });
});

describe("Analytics API", () => {
  it("returns overview metrics", async () => {
    const response = await request(app).get("/api/analytics/overview").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.totalTimeSpent).toBe(45);
    expect(response.body.completedLessons).toBe(1);
  });

  it("returns recommendation data", async () => {
    const response = await request(app).get("/api/analytics/recommendations").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.recommendations)).toBe(true);
  });
});