import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import MentorDashboardPage from "./pages/MentorDashboardPage";
import LessonsPage from "./pages/LessonsPage";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute roles={["student"]}>
          <StudentDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mentor"
      element={
        <ProtectedRoute roles={["mentor"]}>
          <MentorDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/lessons"
      element={
        <ProtectedRoute roles={["student", "mentor"]}>
          <LessonsPage />
        </ProtectedRoute>
      }
    />
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
