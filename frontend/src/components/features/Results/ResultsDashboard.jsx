import { RESULT_TABS } from '../../../constants'
import { downloadReport } from '../../../utils/downloadReport'
import Button from '../../ui/Button'
import OverviewTab from './OverviewTab'
import { ActionPlanTab, FullReportTab, GapAnalysisTab } from './TextTabs'

const renderTab = (tab, report, rawReport) => {
  switch (tab) {
    case 'gaps':
      return <GapAnalysisTab report={report} />
    case 'plan':
      return <ActionPlanTab report={report} />
    case 'report':
      return <FullReportTab rawReport={rawReport} />
    case 'overview':
    default:
      return <OverviewTab report={report} />
  }
}

export default function ResultsDashboard({
  activeTab,
  form,
  onChangeTab,
  onReset,
  rawReport,
  report,
}) {
  return (
    <div className="fade-up stack-lg" style={{ padding: '28px 24px 24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div className="stack-sm">
          <p className="eyebrow">Analysis Complete</p>
          <h2 className="section-title">Your role-fit dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={() => downloadReport({ rawReport, parsedReport: report, ...form })}
          >
            Download report
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Start over
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          paddingBottom: '6px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        {RESULT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.72rem 1rem',
              background: tab.id === activeTab ? 'var(--brand-soft)' : 'transparent',
              color: tab.id === activeTab ? 'var(--brand)' : 'var(--text-muted)',
              fontWeight: 700,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab(activeTab, report, rawReport)}
    </div>
  )
}
