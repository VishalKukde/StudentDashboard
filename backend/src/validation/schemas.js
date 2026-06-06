const isEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateAuth = (body = {}) => {
  const errors = [];
  const value = {
    name: typeof body.name === "string" ? body.name.trim() : "",
    email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
    password: typeof body.password === "string" ? body.password : "",
    role: body.role === "mentor" ? "mentor" : "student"
  };

  if (!value.name && body.name !== undefined) errors.push("Name is required");
  if (!isEmail(value.email)) errors.push("A valid email is required");
  if (value.password.length < 8) errors.push("Password must be at least 8 characters");

  return { valid: errors.length === 0, errors, value };
};

const validateActivity = (body = {}) => {
  const errors = [];
  const timeSpent = Number(body.timeSpent);
  const value = {
    courseId: body.courseId,
    lessonId: body.lessonId,
    timeSpent,
    activityDate: body.activityDate,
    note: typeof body.note === "string" ? body.note.trim() : ""
  };

  if (!value.courseId) errors.push("Course ID is required");
  if (!value.lessonId) errors.push("Lesson ID is required");
  if (!Number.isFinite(timeSpent) || timeSpent <= 0) errors.push("Time spent must be greater than 0");

  return { valid: errors.length === 0, errors, value };
};

const validateCompleteLesson = (body = {}) => {
  const errors = [];
  const timeSpent = Number(body.timeSpent);
  const value = {
    lessonId: body.lessonId,
    courseId: body.courseId,
    timeSpent,
    activityDate: body.activityDate,
    note: typeof body.note === "string" ? body.note.trim() : ""
  };

  if (!value.lessonId) errors.push("Lesson ID is required");
  if (!value.courseId) errors.push("Course ID is required");
  if (!Number.isFinite(timeSpent) || timeSpent <= 0) errors.push("Time spent must be greater than 0");

  return { valid: errors.length === 0, errors, value };
};

module.exports = { validateAuth, validateActivity, validateCompleteLesson };
