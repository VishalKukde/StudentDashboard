"use client";

import { downloadCsv } from "../lib/download";

const actions = [
  { label: "Export Progress CSV", endpoint: "/exports/progress.csv", filename: "course-progress.csv" },
  { label: "Export Activity CSV", endpoint: "/exports/activities.csv", filename: "activity-history.csv" }
];

export const ExportActions = ({ mentor }: { mentor?: boolean }) => {
  const mentorActions = mentor ? [{ label: "Export Mentor CSV", endpoint: "/exports/mentor.csv", filename: "mentor-overview.csv" }] : [];
  const items = [...actions, ...mentorActions];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.endpoint}
          onClick={() => void downloadCsv(item.endpoint, item.filename)}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};