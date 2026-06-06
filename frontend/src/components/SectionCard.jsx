const SectionCard = ({ title, action, children }) => (
  <section className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

export default SectionCard;
