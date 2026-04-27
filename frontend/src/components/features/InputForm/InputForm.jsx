
import ResumeInput from "./ResumeInput.jsx";
import JobInput    from "./JobInput.jsx";
import Button      from "../../ui/Button.jsx";
import Tag         from "../../ui/Tag.jsx";

const InputForm = ({
  resume, onResumeChange,
  jobUrl, onUrlChange,
  onAnalyze,
  error, onClearError,
}) => (
  <main className="flex-1 overflow-y-auto px-12 py-11 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20 dark:to-transparent">

    {/* ── Hero ──────────────────────────────────────────────────────────── */}
    <div className="max-w-xl mb-10 animate-fade-up">
      <div className="mb-5">
        <Tag color="#2563eb">AI-Powered Gap Analysis · 3MTT Cohort 2</Tag>
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-slate-50 mb-4">
        Find out how well your resume{" "}
        <span className="text-gradient">matches a job</span>
      </h1>

      <p className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
        Paste your resume and a job URL. The n8n workflow scrapes the listing,
        runs 3 Gemini AI chains, and returns a full gap analysis with a
        personalised learning roadmap.
      </p>
    </div>

    {/* ── Error alert ───────────────────────────────────────────────────── */}
    {error && (
      <div className="flex items-center justify-between mb-5 px-4 py-3 rounded-xl
                      bg-red-50 border border-red-200 text-sm text-red-600
                      dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400
                      animate-fade-in">
        <span>⚠ {error}</span>
        <button
          onClick={onClearError}
          className="ml-3 text-red-400 hover:text-red-600 dark:hover:text-red-300 text-base leading-none"
        >
          ✕
        </button>
      </div>
    )}

    {/* ── Two-column form grid ───────────────────────────────────────────── */}
    <div className="grid grid-cols-2 gap-5 mb-7 animate-fade-up delay-2">
      <ResumeInput value={resume} onChange={onResumeChange} />
      <JobInput jobUrl={jobUrl} onUrlChange={onUrlChange} />
    </div>

    {/* ── CTA ───────────────────────────────────────────────────────────── */}
    <div className="flex items-center gap-4 animate-fade-up delay-3">
      <Button onClick={onAnalyze}>⚡ Analyze My Fit</Button>
      <span className="text-sm text-slate-400 dark:text-slate-500">
        ~30–60 seconds · 3 Gemini chains · Powered by n8n
      </span>
    </div>
  </main>
);

export default InputForm;
