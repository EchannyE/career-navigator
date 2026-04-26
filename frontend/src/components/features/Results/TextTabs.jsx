import BulletList from '../../ui/BulletList'
import Card from '../../ui/Card'
import SectionLabel from '../../ui/SectionLabel'

export function GapAnalysisTab({ report }) {
  return (
    <Card>
      <div className="stack-md">
        <SectionLabel>Gap Analysis</SectionLabel>
        <BulletList items={report.gaps} />
      </div>
    </Card>
  )
}

export function ActionPlanTab({ report }) {
  return (
    <Card>
      <div className="stack-md">
        <SectionLabel>Action Plan</SectionLabel>
        <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.8rem' }}>
          {report.actionPlan.map((item) => (
            <li key={item} style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  )
}

export function FullReportTab({ rawReport }) {
  return (
    <Card>
      <div className="stack-md">
        <SectionLabel>Raw Model Output</SectionLabel>
        <div className="mono-block muted">{rawReport || 'No raw report available.'}</div>
      </div>
    </Card>
  )
}
