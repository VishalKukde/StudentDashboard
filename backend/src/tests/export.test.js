const request = require("supertest");
const bcrypt = require("bcryptjs");
const { app } = require("../server");
const { resetStore, createRecord } = require("../store");
const { signToken } = require("../utils/jwt");

let studentToken;
let mentorToken;
let studentId;

beforeEach(async () => {
  process.env.JWT_SECRET = "test-secret";
  await resetStore();

  const student = await createRecord("users", {
    name: "Student One",
    email: "student1@test.com",
    password: await bcrypt.hash("Password123!", 12),
    role: "student"
  });

  const mentor = await createRecord("users", {
    name: "Mentor One",
    email: "mentor1@test.com",
    password: await bcrypt.hash("Password123!", 12),
    role: "mentor"
  });

  const course = await createRecord("courses", { title: "React", description: "React course" });
  const lesson = await createRecord("lessons", { courseId: course._id, title: "Intro", duration: 30 });
  studentId = student._id;

  await createRecord("progress", { studentId: student._id, courseId: course._id, lessonId: lesson._id, completed: true, completedAt: new Date().toISOString() });
  await createRecord("activities", { studentId: student._id, courseId: course._id, lessonId: lesson._id, timeSpent: 45, activityDate: new Date().toISOString() });

  studentToken = signToken({ id: student._id, role: student.role });
  mentorToken = signToken({ id: mentor._id, role: mentor.role });
});

describe("Export API", () => {
  it("returns course progress csv", async () => {
    const response = await request(app).get("/api/exports/progress.csv").set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/csv");
    expect(response.text).toContain("Student ID");
    expect(response.text).toContain(String(studentId));
  });

  it("returns mentor overview csv for mentor users", async () => {
    const response = await request(app).get("/api/exports/mentor.csv").set("Authorization", `Bearer ${mentorToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain("Completion %");
    expect(response.text).toContain("Learning Hours");
  });
});