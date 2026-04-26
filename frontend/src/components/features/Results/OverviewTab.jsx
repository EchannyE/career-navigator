import { SCORE_BANDS } from '../../../constants'
import BulletList from '../../ui/BulletList'
import Card from '../../ui/Card'
import ScoreRing from '../../ui/ScoreRing'
import SectionLabel from '../../ui/SectionLabel'
import Tag from '../../ui/Tag'

const getScoreBand = (score) => SCORE_BANDS.find((band) => score >= band.min) || SCORE_BANDS.at(-1)

export default function OverviewTab({ report }) {
  const scoreBand = getScoreBand(report.matchScore)

  return (
    <div className="grid-two" style={{ alignItems: 'start' }}>
      <Card>
        <div className="stack-md">
          <SectionLabel>Match Readout</SectionLabel>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <ScoreRing score={report.matchScore} />
            <div className="stack-sm" style={{ flex: 1, minWidth: 220 }}>
              <Tag tone={scoreBand.tone}>{scoreBand.label}</Tag>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{scoreBand.description}</p>
              <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
                {report.roleSummary || 'No high-level summary was returned yet.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="stack-md">
          <SectionLabel>Priority Gaps</SectionLabel>
          <BulletList items={report.gaps} />
        </div>
      </Card>

      <Card>
        <div className="stack-md">
          <SectionLabel>Strength Signals</SectionLabel>
          <BulletList items={report.strengths} />
        </div>
      </Card>

      <Card>
        <div className="stack-md">
          <SectionLabel>Interview Focus</SectionLabel>
          <BulletList items={report.interviewFocus} />
        </div>
      </Card>
    </div>
  )
}
