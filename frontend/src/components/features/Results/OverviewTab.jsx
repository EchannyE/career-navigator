
import Card         from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";
import BulletList   from "../../ui/BulletList.jsx";
import Tag          from "../../ui/Tag.jsx";

const OverviewTab = ({ parsed }) => {
  const { matchedSkills, skillGaps, expGaps, missingKw } = parsed;

  return (
    <div className="grid grid-cols-2 gap-4 animate-fade-in">

      {/* Matched skills */}
      <div className="card p-6 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/[0.04]">
        <SectionLabel>✓ Matched Skills</SectionLabel>
        <BulletList items={matchedSkills} color="#10b981" icon="✓" />
      </div>

      {/* Skill gaps */}
      <div className="card p-6 border-red-200 dark:border-red-500/20 bg-red-50/40 dark:bg-red-500/[0.04]">
        <SectionLabel>✗ Skill Gaps</SectionLabel>
        <BulletList items={skillGaps} color="#ef4444" icon="✗" emptyText="No significant gaps found." />
      </div>

      {/* Missing keywords */}
      <div className="card p-6 border-amber-200 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/[0.04]">
        <SectionLabel>⚡ Missing Keywords</SectionLabel>
        {missingKw.length === 0
          ? <p className="text-sm text-slate-400 italic">No missing keywords detected.</p>
          : <div className="flex flex-wrap gap-1.5">
              {missingKw.map((kw, i) => <Tag key={i} color="#d97706">{kw}</Tag>)}
            </div>
        }
      </div>

      {/* Experience gaps */}
      <Card>
        <SectionLabel>📋 Experience Gaps</SectionLabel>
        <BulletList items={expGaps} color="#f59e0b" icon="▸" emptyText="No experience gaps found." />
      </Card>
    </div>
  );
};

export default OverviewTab;
