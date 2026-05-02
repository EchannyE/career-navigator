import { useState } from "react";
import ScoreRing from "../../ui/ScoreRing.jsx";
import Tag from "../../ui/Tag.jsx";
import Button from "../../ui/Button.jsx";
import OverviewTab from "./OverviewTab.jsx";
import { GapAnalysisTab, ActionPlanTab, FullReportTab } from "./TextTabs.jsx";
import { downloadReport } from "../../../utils/downloadReport.js";
import { RESULT_TABS } from "../../../constants/index.js";

const ResultsDashboard = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    metadata = {},
    parsed = {},
    gapAnalysis = "",
    actionPlan = "",
    fullReport = "",
  } = report || {};

  const {
    jobTitle = "Unknown Role",
    company = "Unknown Company",
    matchScore = 0,
    scoreBand = { label: "Not Scored", color: "#64748b" },
    generatedAt,
  } = metadata;

  const {
    matchedSkills = [],
    skillGaps = [],
    missingKw = [],
    assessment = "",
  } = parsed;

  const stats = [
    { n: matchedSkills.length, label: "Matched", color: "#10b981" },
    { n: skillGaps.length, label: "Gaps", color: "#ef4444" },
    { n: missingKw.length, label: "Keywords", color: "#f59e0b" },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-7">

      {/* Score hero card */}
      <div className="card p-4 sm:p-5 md:p-6 mb-5 border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-500/[0.07] dark:to-transparent animate-fade-up">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-7">
          <div className="flex justify-center lg:justify-start">
            <ScoreRing score={matchScore} size={140} />
          </div>

          <div className="flex-1 min-w-0 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start gap-2 flex-wrap mb-3">
              <Tag color={scoreBand.color}>{scoreBand.label}</Tag>
              <Tag color="#6366f1">AI Analysis</Tag>
            </div>

            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-1 break-words">
              {jobTitle}
            </h2>

            <p className="text-sm text-slate-400 dark:text-slate-500 mb-3 break-words">
              at {company}
            </p>

            {assessment && (
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {assessment}
              </p>
            )}
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5 shrink-0 w-full lg:w-auto">
            {stats.map(({ n, label, color }) => (
              <div
                key={label}
                className="text-center bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.07] rounded-xl px-3 sm:px-5 py-2.5 min-w-0 lg:min-w-[90px]"
              >
                <div
                  className="font-display text-xl sm:text-2xl font-extrabold leading-none"
                  style={{ color }}
                >
                  {n}
                </div>

                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 overflow-x-auto bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] rounded-xl p-1 animate-fade-up delay-1">
        {RESULT_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`tab-btn whitespace-nowrap flex-1 sm:flex-none ${
              activeTab === key ? "tab-btn-active" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div key={activeTab} className="mb-6">
        {activeTab === "overview" && <OverviewTab parsed={parsed} />}
        {activeTab === "gaps" && <GapAnalysisTab gapAnalysis={gapAnalysis} />}
        {activeTab === "plan" && <ActionPlanTab actionPlan={actionPlan} />}
        {activeTab === "report" && (
          <FullReportTab fullReport={fullReport} generatedAt={generatedAt} />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-2">
        <Button onClick={onReset}>↩ Run Another Analysis</Button>
        <Button variant="ghost" onClick={() => downloadReport(report)}>
          ⬇ Download Report
        </Button>
      </div>
    </main>
  );
};

export default ResultsDashboard;
