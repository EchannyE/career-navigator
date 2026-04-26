import Card from '../../ui/Card'
import Button from '../../ui/Button'
import ResumeInput from './ResumeInput'
import JobInput from './JobInput'

export default function InputForm({ error, form, onChange, onSubmit }) {
  return (
    <div className="grid-two fade-up" style={{ padding: '28px 24px 24px' }}>
      <Card>
        <div className="stack-lg">
          <div className="stack-sm">
            <p className="eyebrow">Career Fit Analysis</p>
            <h2 className="section-title">Turn your resume into an interview plan.</h2>
            <p className="section-copy">
              Paste your resume, add a target job, and generate a structured gap analysis with concrete next steps.
            </p>
          </div>
          <ResumeInput value={form.resumeText} onChange={(value) => onChange('resumeText', value)} />
        </div>
      </Card>

      <Card>
        <div className="stack-lg">
          <JobInput
            jobUrl={form.jobUrl}
            jobDescription={form.jobDescription}
            onChange={onChange}
          />
          {error ? (
            <p style={{ margin: 0, color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <p className="muted" style={{ margin: 0, maxWidth: '34ch' }}>
              If no backend is configured, the app generates a local fallback report so the workflow still works.
            </p>
            <Button onClick={onSubmit}>Analyze fit</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
