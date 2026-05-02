/**
 * components/features/Results/TextTabs.jsx
 */

import Card from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";
import Button from "../../ui/Button.jsx";
import { downloadReport } from "../../../utils/downloadReport.js";

const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
};

export const GapAnalysisTab = ({ gapAnalysis = "" }) => (
  <Card className="animate-fade-in">
    <SectionLabel>Full Gap Analysis</SectionLabel>
    <div className="prose-mono">
      {gapAnalysis || "No gap analysis available."}
    </div>
  </Card>
);

export const ActionPlanTab = ({ actionPlan = "" }) => (
  <Card className="animate-fade-in">
    <SectionLabel>Your Personalised Learning Roadmap</SectionLabel>
    <div className="prose-mono">
      {actionPlan || "No action plan available."}
    </div>
  </Card>
);

export const FullReportTab = ({ report }) => {
  const generatedAt = formatDate(report?.metadata?.generatedAt);
  const hasReport = Boolean(report?.fullReport?.trim());

  return (
    <Card className="animate-fade-in">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <SectionLabel className="mb-0.5">Complete Report</SectionLabel>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Generated: {generatedAt}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => downloadReport(report)}
          disabled={!hasReport}
          className="text-xs py-2 px-3.5"
        >
          ⬇ Download .html
        </Button>
      </div>

      <div className="prose-mono">
        {report?.fullReport || "No full report available."}
      </div>
    </Card>
  );
};
