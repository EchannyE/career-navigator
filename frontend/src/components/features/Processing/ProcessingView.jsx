import Card from '../../ui/Card'
import { PROCESSING_STEPS } from '../../../constants'

export default function ProcessingView({ activeStep, statusMessage }) {
  return (
    <div className="fade-up" style={{ padding: '32px 24px 24px' }}>
      <Card padding="32px">
        <div className="stack-lg" style={{ justifyItems: 'center', textAlign: 'center' }}>
          <div className="processing-pulse">
            <strong style={{ fontSize: '1.3rem' }}>AI</strong>
          </div>
          <div className="stack-sm" style={{ justifyItems: 'center' }}>
            <p className="eyebrow">Processing</p>
            <h2 className="section-title">Building your analysis</h2>
            <p className="section-copy">{statusMessage}</p>
          </div>
          <div style={{ width: '100%', maxWidth: 720, display: 'grid', gap: '12px' }}>
            {PROCESSING_STEPS.map((step, index) => {
              const isComplete = index < activeStep
              const isCurrent = index === activeStep

              return (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: isCurrent ? 'var(--brand-soft)' : 'var(--surface-strong)',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '999px',
                      display: 'grid',
                      placeItems: 'center',
                      background: isComplete || isCurrent ? 'var(--brand)' : 'var(--surface)',
                      color: isComplete || isCurrent ? '#fff7f1' : 'var(--text-muted)',
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: isCurrent ? 700 : 500 }}>{step}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
