const CourseProgressTable = ({ courses }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
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
          <tr key={course._id || course.courseName}>
            <td className="px-5 py-4 font-medium">{course.courseName}</td>
            <td className="px-5 py-4">{Math.round(course.completionPercentage)}%</td>
            <td className="px-5 py-4">{course.completedLessons}</td>
            <td className="px-5 py-4">{course.remainingLessons}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CourseProgressTable;
