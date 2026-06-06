"use client";

import type { CourseProgressItem } from "../lib/types";

export const CourseProgressTable = ({ courses }: { courses: CourseProgressItem[] }) => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
    <table className="min-w-full divide-y divide-slate-200 text-left">
      <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
        <tr>
          <th className="px-5 py-4">Course</th>
          <th className="px-5 py-4">Progress</th>
          <th className="px-5 py-4">Lessons Completed</th>
          <th className="px-5 py-4">Remaining</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-slate-800">
        {courses.map((course) => (
          <tr key={course._id || course.courseName} className="hover:bg-slate-50/80">
            <td className="px-5 py-4 font-medium text-slate-950">{course.courseName}</td>
            <td className="px-5 py-4">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{Math.round(course.completionPercentage)}%</span>
            </td>
            <td className="px-5 py-4">{course.completedLessons}</td>
            <td className="px-5 py-4">{course.remainingLessons}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);