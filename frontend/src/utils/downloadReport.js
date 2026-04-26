export function downloadReport({ rawReport, parsedReport, jobDescription, resumeText }) {
  const content = [
    '# Career Coach Report',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    '## Overview',
    '',
    `Match score: ${parsedReport.matchScore}/100`,
    '',
    parsedReport.roleSummary || 'No summary available.',
    '',
    '## Strengths',
    ...parsedReport.strengths.map((item) => `- ${item}`),
    '',
    '## Gaps',
    ...parsedReport.gaps.map((item) => `- ${item}`),
    '',
    '## Action Plan',
    ...parsedReport.actionPlan.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## Interview Focus',
    ...parsedReport.interviewFocus.map((item) => `- ${item}`),
    '',
    '## Keywords',
    parsedReport.keywords.join(', '),
    '',
    '## Job Description',
    jobDescription,
    '',
    '## Resume',
    resumeText,
    '',
    '## Raw Report',
    rawReport,
  ].join('\n')

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'career-coach-report.md'
  link.click()
  URL.revokeObjectURL(url)
}
