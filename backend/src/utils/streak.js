export const getCurrentStreak = (activities = []) => {
  const uniqueDays = [
    ...new Set(
      activities
        .map((activity) => new Date(activity.activityDate).toISOString().slice(0, 10))
        .sort()
    )
  ];

  if (!uniqueDays.length) return 0;

  let streak = 1;
  let cursor = new Date(uniqueDays[uniqueDays.length - 1]);

  for (let i = uniqueDays.length - 2; i >= 0; i -= 1) {
    const prev = new Date(uniqueDays[i]);
    const diffDays = Math.round((cursor - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak += 1;
      cursor = prev;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
};
