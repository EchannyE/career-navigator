/**
 * components/features/InputForm/JobInput.jsx
 */

import Card from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";

const MAX_CHARS = 20000;

const JobInput = ({
  jobMode,
  onJobModeChange,
  jobUrl,
  onUrlChange,
  jobPaste,
  onPasteChange,
}) => {
  const pasteLength = jobPaste?.length || 0;

  return (
    <Card className="flex flex-col gap-4">

      {/* ── Mode toggle ── */}
      <div>
        <SectionLabel>Job Posting</SectionLabel>

        <div className="flex gap-2">
          {[
            { mode: "url", label: "🔗 Job URL" },
            { mode: "paste", label: "📋 Paste Description" },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onJobModeChange(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition
                ${
                  jobMode === mode
                    ? "bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/40"
                    : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-400"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── URL mode ── */}
      {jobMode === "url" && (
        <>
          {/* URL input */}
          <div>
            <div className="flex items-center gap-2.5 field px-3.5 h-11 !py-0">
              <svg className="shrink-0 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="url"
                value={jobUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://jobs.lever.co/company/job-id"
                className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
              />
            </div>

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              The system will scrape this page automatically.
            </p>
          </div>

          {/* Compatible platforms */}
          <div>
            <SectionLabel>Works best with</SectionLabel>

            <div className="flex flex-wrap gap-2">
              {["Lever", "Greenhouse", "Workable", "SmartRecruiters", "Company career pages"].map(
                (p) => (
                  <span
                    key={p}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500
                               dark:border-white/[0.08] dark:text-slate-400 bg-slate-50 dark:bg-white/[0.03]"
                  >
                    {p}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-xl p-3.5 bg-amber-50 border border-amber-200
                          dark:bg-amber-500/10 dark:border-amber-500/20">
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>Some links may be blocked.</strong> LinkedIn, Indeed, Glassdoor,
              Amazon, Meta, and Google Careers often prevent scraping.
              <br />
              Switch to{" "}
              <button
                type="button"
                onClick={() => onJobModeChange("paste")}
                className="underline font-semibold cursor-pointer bg-transparent border-none
                           text-amber-700 dark:text-amber-400"
              >
                Paste Description
              </button>{" "}
              mode instead.
            </p>
          </div>
        </>
      )}

      {/* ── Paste mode ── */}
      {jobMode === "paste" && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel className="mb-0">Job Description</SectionLabel>

              <span
                className={`text-xs font-mono ${
                  pasteLength > MAX_CHARS * 0.9
                    ? "text-red-500"
                    : pasteLength > MAX_CHARS * 0.7
                    ? "text-amber-500"
                    : "text-slate-400"
                }`}
              >
                {pasteLength.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>

            <textarea
              value={jobPaste}
              onChange={(e) => onPasteChange(e.target.value.slice(0, MAX_CHARS))}
              maxLength={MAX_CHARS}
              placeholder={`Paste the full job description here…

Include:
• Job title and company name
• Responsibilities
• Required skills and qualifications
• Preferred qualifications
• Tools and technologies`}
              className="field font-mono text-xs leading-relaxed resize-y min-h-[260px]"
            />

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              More detail = better AI analysis.
            </p>
          </div>

          {/* Info box */}
          <div className="rounded-xl p-3.5 bg-blue-50 border border-blue-200
                          dark:bg-blue-500/10 dark:border-blue-500/20">
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              <strong>Paste mode:</strong> This skips scraping and sends the job
              description directly to the AI. Best for restricted or dynamic pages.
            </p>
          </div>
        </>
      )}
    </Card>
  );
};

export default JobInput;
