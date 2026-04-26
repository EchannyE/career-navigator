
import Card         from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";

const MAX_CHARS = 6000;

const ResumeInput = ({ value, onChange }) => (
  <Card>
    <div className="flex items-center justify-between mb-3">
      <SectionLabel className="mb-0">My Resume</SectionLabel>
      <span className={`text-xs font-mono ${value.length > MAX_CHARS * 0.9 ? "text-amber-500" : "text-slate-400"}`}>
        {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </span>
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={MAX_CHARS}
      placeholder={`Paste your resume here...\n\nExample:\nFull-stack developer, 2 years experience.\nSkills: Node.js, React, MongoDB, n8n, REST APIs.\nProjects: ScoreFlow AI, Objective Lens, ThriftSync.`}
      className="field font-mono text-xs leading-relaxed resize-y min-h-[240px]"
    />
  </Card>
);

export default ResumeInput;
