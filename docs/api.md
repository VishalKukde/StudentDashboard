Mentor ID : mentor1@example.com, Password123!

# API Documentation

Base URL: `http://localhost:5000/api`

This document describes the complete REST API for the Progressive Student Dashboard.
The backend uses a local JSON file store, so no MongoDB setup is required.

## Overview

### Auth model

All protected endpoints require a JWT in the `Authorization` header.

```http
Authorization: Bearer <token>
```

### Roles

- `student`
- `mentor`

### Common response patterns

Success responses are returned as JSON.
Error responses generally follow this shape:

```json
{
  "message": "Human readable error message",
  "details": []
}
```

### Health check

- `GET /health`

Example response:

```json
{
  "status": "ok",
  "service": "student-dashboard-api"
}
```

## Authentication

### `POST /auth/register`

Create a new student or mentor account.

Request body:

```json
{
  "name": "Aarav Student",
  "email": "student@example.com",
  "password": "Password123!",
  "role": "student"
}
```

Validation rules:

- `name` is required
- `email` must be valid
- `password` must be at least 8 characters
- `role` defaults to `student` if omitted

Success response: `201`

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Aarav Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

Common errors:

- `409 Email already registered`
- `400 Validation failed`

### `POST /auth/login`

Sign in with email and password.

Request body:

```json
{
  "email": "student1@example.com",
  "password": "Password123!"
}
```

Success response: `200`

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Aarav Student",
    "email": "student1@example.com",
    "role": "student"
  }
}
```

Common errors:

- `401 Invalid credentials`
- `400 Validation failed`

### `GET /auth/profile`

Return the authenticated user profile.

Headers:

```http
Authorization: Bearer <token>
```

Success response: `200`

```json
{
  "user": {
    "id": "user-id",
    "name": "Aarav Student",
    "email": "student1@example.com",
    "role": "student"
  }
}
```

## Courses

### `GET /courses`

Return all courses with computed lesson counts.

Headers:

```http
Authorization: Bearer <token>
```

Success response: `200`

```json
{
  "courses": [
    {
      "_id": "course-id",
      "title": "React Foundations",
      "description": "React Foundations for progressive student growth and project readiness.",
      "level": "Beginner",
      "order": 1,
      "tags": ["mern", "dashboard", "learning"],
      "lessonsCount": 10,
      "createdAt": "2026-06-06T06:51:45.573Z",
      "updatedAt": "2026-06-06T06:51:45.573Z"
    }
  ]
}
```

### `GET /courses/:id`

Return a single course with its lessons.

Headers:

```http
Authorization: Bearer <token>
```

Success response: `200`

```json
{
  "course": {
    "_id": "course-id",
    "title": "React Foundations",
    "description": "React course description"
  },
  "lessons": [
    {
      "_id": "lesson-id",
      "courseId": "course-id",
      "title": "React Foundations Lesson 1",
      "duration": 25,
      "order": 1,
      "content": "Lesson content for React Foundations 1",
      "createdAt": "2026-06-06T06:51:45.573Z",
      "updatedAt": "2026-06-06T06:51:45.573Z"
    }
  ]
}
```

Common errors:

- `404 Course not found`

## Lessons

### `GET /lessons/:id`

Return a lesson by ID.

Headers:

```http
Authorization: Bearer <token>
```

Success response: `200`

```json
{
  "lesson": {
    "_id": "lesson-id",
    "courseId": {
      "_id": "course-id",
      "title": "React Foundations",
      "description": "React course description"
    },
    "title": "React Foundations Lesson 1",
    "duration": 25,
    "order": 1,
    "content": "Lesson content for React Foundations 1"
  }
}
```

Common errors:

- `404 Lesson not found`

### `POST /lessons/complete`

Mark a lesson as completed and create a matching activity record.

Headers:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "lessonId": "lesson-id",
  "courseId": "course-id",
  "timeSpent": 45,
  "activityDate": "2026-06-06T12:00:00.000Z",
  "note": "Completed lesson and reviewed notes"
}
```

Validation rules:

- `lessonId` is required
- `courseId` is required
- `timeSpent` must be greater than `0`

Success response: `200`

```json
{
  "progress": {
    "_id": "progress-id",
    "studentId": "user-id",
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "completed": true,
    "completedAt": "2026-06-06T12:00:00.000Z"
  },
  "activity": {
    "_id": "activity-id",
    "studentId": "user-id",
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "timeSpent": 45,
    "activityDate": "2026-06-06T12:00:00.000Z",
    "note": "Completed lesson and reviewed notes"
  }
}
```

## Activities

### `POST /activities`

Create a learning activity record.

Headers:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "courseId": "course-id",
  "lessonId": "lesson-id",
  "timeSpent": 30,
  "activityDate": "2026-06-06T12:00:00.000Z",
  "note": "Revision session"
}
```

Validation rules:

- `courseId` is required
- `lessonId` is required
- `timeSpent` must be greater than `0`

Success response: `201`

```json
{
  "activity": {
    "_id": "activity-id",
    "studentId": "user-id",
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "timeSpent": 30,
    "activityDate": "2026-06-06T12:00:00.000Z",
    "note": "Revision session"
  }
}
```

### `GET /activities`

Return activities for the current user. Mentors see all activities.

Headers:

```http
Authorization: Bearer <token>
```

Success response: `200`

```json
{
  "activities": [
    {
      "_id": "activity-id",
      "studentId": {
        "_id": "user-id",
        "name": "Aarav Student",
        "email": "student1@example.com",
        "role": "student"
      },
      "courseId": {
        "_id": "course-id",
        "title": "React Foundations"
      },
      "lessonId": {
        "_id": "lesson-id",
        "title": "React Foundations Lesson 1",
        "duration": 25
      },
      "timeSpent": 30,
      "activityDate": "2026-06-06T12:00:00.000Z",
      "note": "Revision session"
    }
  ]
}
```

## Analytics

### `GET /analytics/overview`

Return the main student metrics.

Headers:

```http
Authorization: Bearer <token>
```

Optional query params for mentors:

- `studentId`

Success response: `200`

```json
{
  "totalCoursesEnrolled": 10,
  "completedLessons": 42,
  "totalTimeSpent": 820,
  "currentLearningStreak": 5
}
```

### `GET /analytics/progress`

Return per-course completion stats.

Headers:

```http
Authorization: Bearer <token>
```

Optional query params for mentors:

- `studentId`

Success response: `200`

```json
{
  "progress": [
    {
      "_id": "course-id",
      "courseName": "React Foundations",
      "totalLessons": 10,
      "completedLessons": 7,
      "remainingLessons": 3,
      "completionPercentage": 70
    }
  ]
}
```

### `GET /analytics/timeseries`

Return learning activity over time.

Headers:

```http
Authorization: Bearer <token>
```

Query params:

- `range`: `7d`, `30d`, or `90d`
- `studentId` for mentor access

Success response: `200`

```json
{
  "range": "7d",
  "data": [
    {
      "_id": { "day": "2026-06-06" },
      "totalTimeSpent": 120,
      "activities": 4
    }
  ]
}
```

### `GET /analytics/distribution`

Return progress distribution for the selected user.

Headers:

```http
Authorization: Bearer <token>
```

Optional query params for mentors:

- `studentId`

Success response: `200`

```json
{
  "distribution": [
    { "name": "Completed", "value": 42 },
    { "name": "In Progress", "value": 12 },
    { "name": "Not Started", "value": 6 }
  ]
}
```

### `GET /analytics/recommendations`

Return adaptive recommendations per course.

Headers:

```http
Authorization: Bearer <token>
```

Optional query params for mentors:

- `studentId`

Success response: `200`

```json
{
  "recommendations": [
    {
      "courseId": "course-id",
      "courseName": "React Foundations",
      "completionPercentage": 70,
      "suggestions": [
        "Keep a steady study rhythm.",
        "Complete the next few lessons to unlock more advanced content.",
        "Review previous lesson summaries before the next study session."
      ]
    }
  ]
}
```

### `GET /analytics/mentor`

Mentor-only overview with leaderboard and at-risk students.

Headers:

```http
Authorization: Bearer <token>
```

Role required:

- `mentor`

Success response: `200`

```json
{
  "totalStudents": 20,
  "averageCompletionPercentage": 64.5,
  "averageLearningHours": 18.2,
  "leaderboard": [
    {
      "studentId": "student-id",
      "completionPercentage": 92,
      "learningHours": 24.5,
      "lastActivity": "2026-06-06T12:00:00.000Z"
    }
  ],
  "atRiskStudents": [
    {
      "studentId": "student-id",
      "completionPercentage": 12,
      "learningHours": 4.2,
      "lastActivity": "2026-05-26T12:00:00.000Z"
    }
  ]
}
```

## Exports

All export endpoints return downloadable CSV files.

### `GET /exports/progress.csv`

Export progress records for the current user.

Headers:

```http
Authorization: Bearer <token>
```

Optional query params for mentors:

- `studentId`

CSV columns:

- `Student ID`
- `Course`
- `Lesson`
- `Completed`
- `Completed At`

### `GET /exports/activities.csv`

Export activity history for the current user.

Headers:

```http
Authorization: Bearer <token>
```

Optional query params for mentors:

- `studentId`

CSV columns:

- `Student ID`
- `Course ID`
- `Lesson ID`
- `Time Spent (min)`
- `Activity Date`
- `Note`

### `GET /exports/mentor.csv`

Mentor-only export of student performance overview.

Headers:

```http
Authorization: Bearer <token>
```

Role required:

- `mentor`

CSV columns:

- `Student ID`
- `Name`
- `Email`
- `Completion %`
- `Learning Hours`

## Data model reference

### User

- `id`
- `name`
- `email`
- `password`
- `role`

### Course

- `id`
- `title`
- `description`
- `level`
- `order`
- `tags`

### Lesson

- `id`
- `courseId`
- `title`
- `duration`
- `order`
- `content`

### Progress

- `id`
- `studentId`
- `courseId`
- `lessonId`
- `completed`
- `completedAt`

### Activity

- `id`
- `studentId`
- `courseId`
- `lessonId`
- `timeSpent`
- `activityDate`
- `note`

## Sample seeded users

- `student1@example.com` through `student20@example.com`
- `mentor1@example.com` through `mentor5@example.com`
- Password for all seeded accounts: `Password123!`
