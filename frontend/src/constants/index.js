export const SCREENS = {
  INPUT: 'input',
  PROCESSING: 'processing',
  RESULTS: 'results',
}

export const PROCESSING_STEPS = [
  'Reading resume context',
  'Reviewing job requirements',
  'Scoring skill alignment',
  'Drafting action plan',
]

export const RESULT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gaps', label: 'Gap Analysis' },
  { id: 'plan', label: 'Action Plan' },
  { id: 'report', label: 'Full Report' },
]

export const SCORE_BANDS = [
  {
    min: 85,
    label: 'Strong match',
    tone: 'success',
    description: 'You are already aligned with the role and should focus on sharper positioning.',
  },
  {
    min: 70,
    label: 'Competitive',
    tone: 'info',
    description: 'You have a credible profile with a few clear improvement areas.',
  },
  {
    min: 50,
    label: 'Stretch',
    tone: 'warning',
    description: 'You can pursue this role, but your positioning and proof points need work.',
  },
  {
    min: 0,
    label: 'Rebuild needed',
    tone: 'danger',
    description: 'Close core gaps before targeting roles like this aggressively.',
  },
]

export const DEFAULT_REPORT = {
  roleSummary: '',
  matchScore: 0,
  strengths: [],
  gaps: [],
  actionPlan: [],
  keywords: [],
  interviewFocus: [],
  fullReport: '',
}
