# Progressive Student Dashboard

A production-oriented student learning dashboard built with a MERN-style architecture. The frontend uses **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. The backend uses **Node.js**, **Express.js**, **JWT authentication**, and a **local JSON file-backed store** so the project can run without MongoDB.

The app is designed for two user roles:

- **Student**: track courses, lessons, time spent, progress, recommendations, and export reports
- **Mentor**: review student performance, leaderboard data, and at-risk students

## Key Features

- Email/password registration and login
- JWT-based authentication
- Role-based access control for student and mentor routes
- Student dashboard with overview cards, charts, and progress tracking
- Lesson completion and activity logging
- Adaptive learning recommendations
- Mentor dashboard with analytics and performance insights
- CSV export for progress, activity history, and mentor reports
- Responsive UI for desktop and mobile
- Sample backend and frontend tests
- Demo seed data for easy login and walkthroughs

## Tech Stack

### Frontend

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- Vitest + React Testing Library

### Backend

- Node.js
- Express.js
- JWT authentication
- bcryptjs password hashing
- CORS, Helmet, Morgan
- Jest + Supertest
- CSV generation with `csv-stringify`

### Storage

- Local JSON file store under `backend/data/`
- No MongoDB or Atlas setup required for this version

## Repository Structure

```text
backend/   Express API, auth, analytics, exports, seed scripts, tests
frontend/  Next.js App Router UI, dashboards, components, tests
docs/      API documentation, environment guide, interview demo guide
```

## Backend Overview

The backend is responsible for all server-side logic:

- Authentication and JWT token generation
- User profile lookup
- Course and lesson listing
- Lesson completion tracking
- Activity logging
- Analytics calculations
- Mentor summaries and at-risk student detection
- CSV export endpoints
- Demo data seeding

### Backend Scripts

```bash
cd backend
npm install
npm run seed
npm run dev
```

Other scripts:

- `npm start` - run the backend in production mode
- `npm test` - run backend tests
- `npm run seed` - generate demo users, courses, lessons, progress, and activities

### Backend Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/courses`
- `GET /api/courses/:id`
- `GET /api/lessons/:id`
- `POST /api/lessons/complete`
- `POST /api/activities`
- `GET /api/activities`
- `GET /api/analytics/overview`
- `GET /api/analytics/progress`
- `GET /api/analytics/timeseries`
- `GET /api/analytics/distribution`
- `GET /api/exports/progress.csv`
- `GET /api/exports/activities.csv`
- `GET /api/exports/mentor.csv`

## Frontend Overview

The frontend is built with the Next.js App Router and uses a modern, responsive dashboard layout.

### Frontend Areas

- `login` and `register` pages for authentication
- Student dashboard with charts, recommendations, and export actions
- Mentor dashboard with leaderboard, at-risk students, and exports
- Lessons page for lesson browsing and completion actions
- Shared UI components for cards, forms, layout, and reusable actions

### Frontend Scripts

```bash
cd frontend
npm install
npm run dev
```

Other scripts:

- `npm run build` - create a production build
- `npm run start` - run the production build
- `npm run lint` - lint the app
- `npm run test` - run frontend tests

## How the App Works

1. A user registers or logs in.
2. The backend returns a JWT token.
3. The frontend stores the session and loads the correct dashboard.
4. The student dashboard shows progress cards, trend charts, and recommendations.
5. The mentor dashboard shows overall class analytics and performance insights.
6. Lesson completion and activity data are saved in the backend file store.
7. CSV export endpoints create downloadable reports.

## Demo Accounts

The seed script creates demo users for testing.

### Student Accounts

- `student1@example.com`
- `student2@example.com`
- `student3@example.com`
- `student4@example.com`
- `student5@example.com`

### Mentor Accounts

- `mentor1@example.com`
- `mentor2@example.com`
- `mentor3@example.com`
- `mentor4@example.com`
- `mentor5@example.com`

### Demo Password

- `Password123!`

### Quick Mentor Login

- Email: `mentor1@example.com`
- Password: `Password123!`

## Environment Variables

See the full guide in [docs/env.md](docs/env.md).

### Backend `.env`

```env
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URLS=http://localhost:3000,http://localhost:5173
```

### Frontend `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Setup Instructions

### 1. Start the backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the app

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5000/api/health`

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Documentation

Full API details, request examples, and response formats are documented in [docs/api.md](docs/api.md).

## Screenshots Section

Add screenshots here once the app is running locally.

Suggested screenshots:

- Login screen
- Student dashboard overview
- Lesson completion screen
- Adaptive recommendation panel
- Mentor dashboard leaderboard
- At-risk students section
- CSV export download result

## Notes

- This project does not require MongoDB in the current setup.
- The backend stores application data in JSON files under `backend/data/`.
- If you want to switch back to MongoDB later, the backend can be refactored to use Mongoose models again.
- Set `NEXT_PUBLIC_API_URL` if your backend is not running on `http://localhost:5000/api`.
