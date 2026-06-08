export const getRecommendations = ({ completionRate = 0, currentCourse }) => {
  if (completionRate >= 80) {
    return [
      `Great momentum on ${currentCourse || "your current course"}.`,
      "Move to the next advanced course.",
      "Explore challenge-based projects and deeper topics."
    ];
  }

  if (completionRate < 50) {
    return [
      `Your pace on ${currentCourse || "this course"} suggests a revision pass.`,
      "Revisit core lessons and notes.",
      "Practice with short exercises before moving forward."
    ];
  }

  return [
    "Keep a steady study rhythm.",
    "Complete the next few lessons to unlock more advanced content.",
    "Review previous lesson summaries before the next study session."
  ];
};


