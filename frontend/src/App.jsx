import Layout from './components/layout/Layout'
import Header from './components/layout/Header'
import InputForm from './components/features/InputForm/InputForm'
import ProcessingView from './components/features/Processing/ProcessingView'
import ResultsDashboard from './components/features/Results/ResultsDashboard'
import { SCREENS } from './constants'
import { useAnalysis } from './hooks/useAnalysis'
import { useDarkMode } from './hooks/useDarkMode'

function App() {
  const { isDarkMode, toggleTheme } = useDarkMode()
  const {
    activeStep,
    activeTab,
    error,
    form,
    rawReport,
    report,
    screen,
    statusMessage,
    updateField,
    resetAnalysis,
    runAnalysis,
    setActiveTab,
  } = useAnalysis()

  return (
    <Layout>
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      {screen === SCREENS.INPUT ? (
        <InputForm error={error} form={form} onChange={updateField} onSubmit={runAnalysis} />
      ) : null}
      {screen === SCREENS.PROCESSING ? (
        <ProcessingView activeStep={activeStep} statusMessage={statusMessage} />
      ) : null}
      {screen === SCREENS.RESULTS ? (
        <ResultsDashboard
          activeTab={activeTab}
          form={form}
          onChangeTab={setActiveTab}
          onReset={resetAnalysis}
          rawReport={rawReport}
          report={report}
        />
      ) : null}
    </Layout>
  )
}

export default App