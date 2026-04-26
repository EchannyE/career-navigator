      /**
 * components/features/Results/TextTabs.jsx
 * GapAnalysisTab, ActionPlanTab, FullReportTab — text display tabs.
 */
import Card         from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";
import Button       from "../../ui/Button.jsx";
import { downloadReport } from "../../../utils/downloadReport.js";

export const GapAnalysisTab = ({ gapAnalysis }) => (
  <Card className="animate-fade-in">
    <SectionLabel>Full Gap Analysis</SectionLabel>
    <div className="prose-mono">{gapAnalysis}</div>
  </Card>
);

export const ActionPlanTab = ({ actionPlan }) => (
  <Card className="animate-fade-in">
    <SectionLabel>Your Personalised Learning Roadmap</SectionLabel>
    <div className="prose-mono">{actionPlan}</div>
  </Card>
);

export const FullReportTab = ({ fullReport, generatedAt }) => (
  <Card className="animate-fade-in">
    <div className="flex items-center justify-between mb-4">
      <div>
        <SectionLabel className="mb-0.5">Complete Report</SectionLabel>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Generated: {new Date(generatedAt).toLocaleString()}
        </p>
      </div>
      <Button variant="ghost" onClick={() => downloadReport(fullReport)} className="text-xs py-2 px-3.5">
        ⬇ Download .txt
      </Button>
    </div>
    <div className="prose-mono">{fullReport}</div>
  </Card>
);
  
