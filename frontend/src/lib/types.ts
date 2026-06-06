export type UserRole = "student" | "mentor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CourseProgressItem {
  _id?: string;
  courseName: string;
  completionPercentage: number;
  completedLessons: number;
  remainingLessons: number;
}

export interface ActivityItem {
  _id?: string;
  day?: string;
  timeSpent?: number;
  totalTimeSpent?: number;
  activities?: number;
}

export interface RecommendationItem {
  courseId: string;
  courseName: string;
  completionPercentage: number;
  suggestions: string[];
}

export interface DashboardOverview {
  totalCoursesEnrolled: number;
  completedLessons: number;
  totalTimeSpent: number;
  currentLearningStreak: number;
}

export interface LessonItem {
  _id: string;
  courseId: string;
  title: string;
  duration: number;
  order: number;
  content?: string;
}

export interface CourseItem {
  _id: string;
  title: string;
  description: string;
  lessonsCount: number;
}
