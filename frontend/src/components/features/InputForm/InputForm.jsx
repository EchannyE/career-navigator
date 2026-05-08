/**
 * components/features/InputForm/InputForm.jsx
 */

import ResumeInput from "./ResumeInput.jsx";
import JobInput from "./JobInput.jsx";
import Button from "../../ui/Button.jsx";
import Tag from "../../ui/Tag.jsx";

const InputForm = ({
  resume,
  onResumeChange,
  resumeMode,
  onResumeModeChange,

  jobMode,
  onJobModeChange,
  jobUrl,
  onUrlChange,
  jobPaste,
  onPasteChange,

  onAnalyze,
  error,
  onClearError,
}) => {
  const hasResume = resume?.trim().length >= 30;
  const hasJobInput =
    jobMode === "paste"
      ? jobPaste?.trim().length >= 50
      : jobUrl?.trim().length >= 10;

  const canAnalyze = hasResume && hasJobInput;

  return (
    <main
      className="flex-1 overflow-y-auto px-4 py-7 sm:px-6 lg:px-12 lg:py-11
                 bg-gradient-to-b from-blue-50/60 to-transparent
                 dark:from-blue-950/20 dark:to-transparent"
    >
      <div className="max-w-xl mb-8 lg:mb-10 animate-fade-up">
        <div className="mb-5">
          <Tag color="#2563eb">AI-Powered Gap Analysis</Tag>
        </div>

        <h1
          className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight
                     leading-[1.15] text-slate-900 dark:text-slate-50 mb-4"
        >
          Find out how well your resume{" "}
          <span className="text-gradient">matches a job</span>
        </h1>

        <p className="text-sm sm:text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
          Upload or paste your resume, then provide a job URL or paste the
          description directly. The workflow runs 3 Gemini AI chains and returns
          a full gap analysis with a personalised learning roadmap.
        </p>
      </div>

      {error && (
        <div
          className="flex items-start sm:items-center justify-between gap-3 mb-5 px-4 py-3 rounded-xl
                     bg-red-50 border border-red-200 text-sm text-red-600
                     dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400
                     animate-fade-in"
        >
          <span>⚠ {error}</span>

          <button
            type="button"
            onClick={onClearError}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300
                       text-base leading-none bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-7 animate-fade-up delay-2">
        <ResumeInput
          value={resume}
          onChange={onResumeChange}
          resumeMode={resumeMode}
          onModeChange={onResumeModeChange}
        />

        <JobInput
          jobMode={jobMode}
          onJobModeChange={onJobModeChange}
          jobUrl={jobUrl}
          onUrlChange={onUrlChange}
          jobPaste={jobPaste}
          onPasteChange={onPasteChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 animate-fade-up delay-3">
        <Button onClick={onAnalyze} disabled={!canAnalyze}>
          ⚡ Analyze My Fit
        </Button>

        <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
          30–60 seconds · 3 Gemini chains · Powered by n8n
        </span>
      </div>

      {!canAnalyze && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Add a resume and{" "}
          {jobMode === "paste"
            ? "paste a job description"
            : "provide a job URL"}{" "}
          to start the analysis.
        </p>
      )}
    </main>
  );
};

export default InputForm;
