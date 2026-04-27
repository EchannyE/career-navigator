 /**
 * components/features/Results/TextTabs.jsx
 * GapAnalysisTab, ActionPlanTab, FullReportTab — text display tabs.
 */
import Card from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";
import Button from "../../ui/Button.jsx";
import { downloadReport } from "../../../utils/downloadReport.js";

export const GapAnalysisTab = ({ gapAnalysis = "" }) => (
  <Card className="animate-fade-in p-4 sm:p-5 md:p-6">
    <SectionLabel>Full Gap Analysis</SectionLabel>

    <div className="prose-mono max-w-none overflow-x-auto whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
      {gapAnalysis || "No gap analysis available."}
    </div>
  </Card>
);

export const ActionPlanTab = ({ actionPlan = "" }) => (
  <Card className="animate-fade-in p-4 sm:p-5 md:p-6">
    <SectionLabel>Your Personalised Learning Roadmap</SectionLabel>

    <div className="prose-mono max-w-none overflow-x-auto whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
      {actionPlan || "No action plan available."}
    </div>
  </Card>
);

export const FullReportTab = ({ fullReport = "", generatedAt }) => (
  <Card className="animate-fade-in p-4 sm:p-5 md:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <SectionLabel className="mb-0.5">Complete Report</SectionLabel>

        <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
          Generated:{" "}
          {generatedAt ? new Date(generatedAt).toLocaleString() : "Unknown"}
        </p>
      </div>

      <Button
        variant="ghost"
        onClick={() => downloadReport(fullReport)}
        className="w-full sm:w-auto text-xs py-2 px-3.5"
        disabled={!fullReport}
      >
        ⬇ Download .txt
      </Button>
    </div>

    <div className="prose-mono max-w-none overflow-x-auto whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
      {fullReport || "No full report available."}
    </div>
  </Card>
);     
