/**
 * components/ui/BulletList.jsx
 * Renders a string array as a styled bullet list.
 */
const BulletList = ({ items = [], color = "#10b981", icon = "✓", emptyText = "None identified." }) => {
  if (!items.length) return (
    <p className="text-sm text-slate-400 dark:text-slate-600 italic">{emptyText}</p>
  );

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <span className="shrink-0 mt-0.5 font-semibold" style={{ color }}>{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default BulletList;