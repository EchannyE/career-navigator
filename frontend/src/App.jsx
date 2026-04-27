
import Layout from "./components/layout/Layout.jsx";
import Header from "./components/layout/Header.jsx";
import InputForm from "./components/features/InputForm/InputForm.jsx";
import ProcessingView from "./components/features/Processing/ProcessingView.jsx";
import ResultsDashboard from "./components/features/Results/ResultsDashboard.jsx";
import Button from "./components/ui/Button.jsx";

import useDarkMode from "./hooks/useDarkMode.js";
import useAnalysis from "./hooks/useAnalysis.js";
import { SCREENS } from "./constants/index.js";
import { downloadReport } from "./utils/downloadReport.js";

const App = () => {
  const { isDark, toggleDark } = useDarkMode();

  const {
    resume,
    setResume,
    jobUrl,
    setJobUrl,
    screen,
    stepStatus,
    report,
    error,
    setError,
    analyze,
    reset,
  } = useAnalysis();

  const resultsSlot =
    screen === SCREENS.RESULTS && report ? (
      <div className="hidden sm:flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => downloadReport(report.fullReport)}
          className="text-xs py-2 px-3.5"
          disabled={!report.fullReport}
        >
          ⬇ Download
        </Button>

        <Button
          variant="ghost"
          onClick={reset}
          className="text-xs py-2 px-3.5"
        >
          ↩ New Analysis
        </Button>
      </div>
    ) : null;

  return (
    <Layout>
      <Header isDark={isDark} toggleDark={toggleDark} rightSlot={resultsSlot} />

      {screen === SCREENS.INPUT && (
        <InputForm
          resume={resume}
          onResumeChange={setResume}
          jobUrl={jobUrl}
          onUrlChange={setJobUrl}
          onAnalyze={analyze}
          error={error}
          onClearError={() => setError(null)}
        />
      )}

      {screen === SCREENS.PROCESSING && (
        <ProcessingView stepStatus={stepStatus} />
      )}

      {screen === SCREENS.RESULTS && report && (
        <ResultsDashboard report={report} onReset={reset} />
      )}
    </Layout>
  );
};

export default App;
