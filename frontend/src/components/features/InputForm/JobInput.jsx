
import Card         from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";

const JobInput = ({ inputMode, onModeChange, jobUrl, onUrlChange, jobPaste, onPasteChange }) => (
  <Card className="flex flex-col gap-4">

    {/* Mode toggle */}
    <div>
      <SectionLabel>Job Posting</SectionLabel>
      <div className="flex gap-2">
        {[{ mode: "url", label: "🔗 Job URL" }, { mode: "paste", label: "📋 Paste Description" }].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition
              ${inputMode === mode
                ? "bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/40"
                : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-400"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    {inputMode === "url" && (
      <>
        {/* URL input */}
        <div className="flex items-center gap-2.5 field px-3.5 py-0 h-11 !py-0">
          <svg className="shrink-0 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://jobs.lever.co/company/job-id"
            className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
          />
        </div>

        {/* Warning tip */}
        <div className="rounded-xl p-3 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <strong>Best with:</strong> jobs.lever.co, boards.greenhouse.io, linkedin.com/jobs.
            JS-heavy pages (Google, Amazon) may not scrape — use Paste mode instead.
          </p>
        </div>

        {/* Paste fallback */}
        <div>
          <SectionLabel>Paste as Fallback (optional)</SectionLabel>
          <textarea
            value={jobPaste}
            onChange={(e) => onPasteChange(e.target.value)}
            placeholder="If the URL fails to scrape, paste the job description here..."
            className="field font-mono text-xs leading-relaxed resize-y min-h-[80px]"
          />
        </div>
      </>
    )}

    {inputMode === "paste" && (
      <textarea
        value={jobPaste}
        onChange={(e) => onPasteChange(e.target.value)}
        placeholder={`Paste the full job description here...\n\nWe're looking for a Backend Engineer with experience in Node.js, PostgreSQL...`}
        className="field font-mono text-xs leading-relaxed resize-y min-h-[240px]"
      />
    )}
  </Card>
);

export default JobInput;
