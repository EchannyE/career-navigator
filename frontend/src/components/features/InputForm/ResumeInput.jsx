import Card from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";

const MAX_CHARS = 6000;

const ResumeInput = ({ value, onChange }) => (
  <Card className="w-full">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
      <SectionLabel className="mb-0">
        My Resume
      </SectionLabel>

      <span
        className={`text-xs sm:text-sm font-mono ${
          value.length > MAX_CHARS * 0.9
            ? "text-amber-500"
            : "text-slate-400"
        }`}
      >
        {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </span>
    </div>

    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={MAX_CHARS}
      placeholder={`Paste your resume here...\n\nExample:\nFull-stack developer, 2 years experience.\nSkills: Node.js, React, MongoDB, n8n, REST APIs.\nProjects: ScoreFlow AI, Objective Lens, ThriftSync.`}
      className="field w-full font-mono text-xs sm:text-sm leading-relaxed resize-y min-h-[220px] sm:min-h-[240px] md:min-h-[280px]"
    />
  </Card>
);

export default ResumeInput;
