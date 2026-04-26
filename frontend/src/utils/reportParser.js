import { DEFAULT_REPORT } from '../constants'

const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0))

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/\n|,/)
      .map((item) => item.replace(/^[-*\d.)\s]+/, '').trim())
      .filter(Boolean)
  }

  return []
}

const normalizeReport = (value, fallbackText = '') => ({
  ...DEFAULT_REPORT,
  roleSummary: value.roleSummary || value.summary || '',
  matchScore: clampScore(value.matchScore ?? value.score),
  strengths: toList(value.strengths),
  gaps: toList(value.gaps),
  actionPlan: toList(value.actionPlan || value.nextSteps),
  keywords: toList(value.keywords),
  interviewFocus: toList(value.interviewFocus),
  fullReport: value.fullReport || fallbackText || '',
})

const extractJsonBlock = (rawText) => {
  const match = rawText.match(/```json\s*([\s\S]*?)```/i)
  return match ? match[1] : rawText
}

const parseSection = (rawText, heading) => {
  const pattern = new RegExp(`${heading}:?\\s*([\\s\\S]*?)(?=\\n[A-Z][A-Za-z ]+:|$)`, 'i')
  const match = rawText.match(pattern)
  return match ? match[1].trim() : ''
}

export function parseReport(rawInput) {
  if (!rawInput) {
    return DEFAULT_REPORT
  }

  if (typeof rawInput === 'object') {
    return normalizeReport(rawInput, JSON.stringify(rawInput, null, 2))
  }

  const rawText = `${rawInput}`.trim()

  try {
    return normalizeReport(JSON.parse(extractJsonBlock(rawText)), rawText)
  } catch {
    return normalizeReport(
      {
        roleSummary: parseSection(rawText, 'Role Summary'),
        matchScore: parseSection(rawText, 'Match Score'),
        strengths: parseSection(rawText, 'Strengths'),
        gaps: parseSection(rawText, 'Gaps'),
        actionPlan: parseSection(rawText, 'Action Plan'),
        keywords: parseSection(rawText, 'Keywords'),
        interviewFocus: parseSection(rawText, 'Interview Focus'),
        fullReport: rawText,
      },
      rawText,
    )
  }
}
