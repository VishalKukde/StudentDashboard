const request = require("supertest");
const bcrypt = require("bcryptjs");
const { app } = require("../server");
const { resetStore, createRecord } = require("../store");

beforeEach(async () => {
  process.env.JWT_SECRET = "test-secret";
  await resetStore();
});

describe("Auth API", () => {
  it("registers a student", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test Student",
      email: "student@test.com",
      password: "Password123!",
      role: "student"
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("student@test.com");
    expect(response.body.token).toBeTruthy();
  });

  it("rejects invalid login", async () => {
    const hashedPassword = await bcrypt.hash("Password123!", 12);
    await createRecord("users", { name: "Mentor", email: "mentor@test.com", password: hashedPassword, role: "mentor" });

    const response = await request(app).post("/api/auth/login").send({
      email: "mentor@test.com",
      password: "wrongpassword"
    });

    expect(response.status).toBe(401);
  });
});