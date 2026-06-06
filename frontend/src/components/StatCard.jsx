const StatCard = ({ label, value, hint }) => (
  <article className="rounded-3xl border border-sky-100/10 bg-white/8 p-5 shadow-glow backdrop-blur-xl">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
    {hint ? <p className="mt-2 text-sm text-slate-300">{hint}</p> : null}
  </article>
);

export default StatCard;
