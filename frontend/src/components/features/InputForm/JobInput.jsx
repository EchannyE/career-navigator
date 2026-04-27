
import Card from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";

const JobInput = ({ jobUrl, onUrlChange }) => (
  <Card className="flex flex-col gap-4 w-full">

    <div>
      <SectionLabel>Job URL</SectionLabel>

      {/* URL field */}
      <div className="flex items-center gap-2 sm:gap-2.5 field px-3 sm:px-3.5 h-11 !py-0 w-full">
        <svg
          className="shrink-0 text-slate-400"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
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
          className="flex-1 min-w-0 bg-transparent border-none text-sm sm:text-base text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
        />
      </div>
    </div>

    {/* Compatible platforms */}
    <div>
      <SectionLabel>Works best with</SectionLabel>

      <div className="flex flex-wrap gap-2">
        {[
          "Lever",
          "Greenhouse",
          "LinkedIn Jobs",
          "Workable",
          "SmartRecruiters",
        ].map((p) => (
          <span
            key={p}
            className="text-xs sm:text-sm px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500
            dark:border-white/[0.08] dark:text-slate-400 bg-slate-50 dark:bg-white/[0.03]"
          >
            {p}
          </span>
        ))}
      </div>
    </div>

    {/* Warning */}
    <div className="rounded-xl p-3 sm:p-3.5 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
      <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
        <strong>JS-rendered pages</strong> (Google Careers, Amazon, Meta)
        load content via JavaScript after page load, so the scraper may
        return empty HTML. Use a direct ATS link where possible.
      </p>
    </div>

  </Card>
);

export default JobInput;
