
import ResumeInput from "./ResumeInput.jsx";
import JobInput from "./JobInput.jsx";
import Button from "../../ui/Button.jsx";
import Tag from "../../ui/Tag.jsx";

const InputForm = ({
  resume,
  onResumeChange,
  jobUrl,
  onUrlChange,
  onAnalyze,
  error,
  onClearError,
}) => (
  <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-11 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20 dark:to-transparent">

    {/* ── Hero ──────────────────────────────────────────────────────────── */}
    <div className="max-w-xl mb-8 md:mb-10 animate-fade-up">
      <div className="mb-4 md:mb-5">
        <Tag color="#2563eb">AI-Powered Gap Analysis</Tag>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-slate-900 dark:text-slate-50 mb-4">
        Find out how well your resume{" "}
        <span className="text-gradient">matches a job</span>
      </h1>

      <p className="text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-400">
        Paste your resume and a job URL and get a full gap analysis with a
        personalised learning roadmap.
      </p>
    </div>

    {/* ── Error alert ───────────────────────────────────────────────────── */}
    {error && (
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 px-4 py-3 rounded-xl
        bg-red-50 border border-red-200 text-sm text-red-600
        dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400
        animate-fade-in"
      >
        <span>⚠ {error}</span>

        <button
          onClick={onClearError}
          className="self-end sm:self-auto text-red-400 hover:text-red-600 dark:hover:text-red-300 text-base leading-none"
        >
          ✕
        </button>
      </div>
    )}

    {/* ── Responsive form grid ──────────────────────────────────────────── */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7 animate-fade-up delay-2">
      <ResumeInput value={resume} onChange={onResumeChange} />
      <JobInput jobUrl={jobUrl} onUrlChange={onUrlChange} />
    </div>

    {/* ── CTA ───────────────────────────────────────────────────────────── */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up delay-3">
      <Button onClick={onAnalyze}>
        ⚡ Analyze My Fit
      </Button>

      <span className="text-sm text-slate-400 dark:text-slate-500">
        ~30–60 seconds
      </span>
    </div>
  </main>
);

export default InputForm;
