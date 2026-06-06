const RecommendationPanel = ({ recommendations }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {recommendations.map((item) => (
      <article key={item.courseId} className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">{item.courseName}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{Math.round(item.completionPercentage)}% complete</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {item.suggestions.map((suggestion) => (
            <li key={suggestion} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-mint-500" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </article>
    ))}
  </div>
);

export default RecommendationPanel;
