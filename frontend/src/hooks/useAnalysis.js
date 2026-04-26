import { useMemo, useState } from 'react'
import { callClaude, callN8nWebhook, fetchJobPage } from '../api/coachApi'
import { DEFAULT_REPORT, PROCESSING_STEPS, RESULT_TABS, SCREENS } from '../constants'
import { parseReport } from '../utils/reportParser'

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

const buildMockReport = ({ resumeText, jobDescription, jobUrl }) => {
  const sourceText = `${resumeText} ${jobDescription}`.toLowerCase()
  const keywordUniverse = ['react', 'leadership', 'sql', 'product', 'analytics', 'python', 'stakeholder']
  const keywords = keywordUniverse.filter((keyword) => sourceText.includes(keyword))
  const scoreBase = 48 + Math.min(42, keywords.length * 8) + Math.min(10, Math.floor(resumeText.length / 350))
  const matchScore = Math.min(96, scoreBase)

  return {
    roleSummary: jobDescription
      ? 'Your resume shows relevant signal for this role, but the strongest case will come from sharper evidence against the posted requirements.'
      : 'Your resume has usable material, but the match is being estimated without a pasted job description.',
    matchScore,
    strengths: [
      'Resume contains concrete execution language instead of vague responsibilities.',
      'Experience suggests transferable delivery skills that can be reframed for adjacent roles.',
      keywords.length > 0
        ? `Relevant keywords already present: ${keywords.join(', ')}.`
        : 'Your current draft needs more explicit role-specific keyword coverage.',
    ],
    gaps: [
      'Bullet points need more quantified outcomes tied to business impact.',
      'Role fit would be stronger with direct language mirroring the target job description.',
      jobUrl ? `The job link ${jobUrl} should be cross-checked against the live posting before applying.` : 'Add the live job posting URL for a tighter comparison.',
    ],
    actionPlan: [
      'Rewrite the top third of the resume around the role title and 3 high-value skills.',
      'Replace generic bullets with metrics, scope, and decision ownership.',
      'Prepare two interview stories that prove execution under ambiguity.',
    ],
    keywords: keywords.length > 0 ? keywords : ['ownership', 'results', 'cross-functional'],
    interviewFocus: [
      'Explain one project where you improved an outcome that leadership cared about.',
      'Be ready to describe tradeoffs, constraints, and how you prioritized next steps.',
    ],
    fullReport: JSON.stringify(
      {
        note: 'Generated fallback report because no backend endpoint is configured.',
        jobDescription,
        resumeLength: resumeText.length,
        matchScore,
      },
      null,
      2,
    ),
  }
}

const extractResponseText = (response) => {
  if (typeof response === 'string') {
    return response
  }

  if (response?.content?.[0]?.text) {
    return response.content[0].text
  }

  if (response?.text) {
    return response.text
  }

  if (response?.output) {
    return typeof response.output === 'string' ? response.output : JSON.stringify(response.output, null, 2)
  }

  return JSON.stringify(response, null, 2)
}

export function useAnalysis() {
  const [form, setForm] = useState({
    resumeText: '',
    jobUrl: '',
    jobDescription: '',
  })
  const [screen, setScreen] = useState(SCREENS.INPUT)
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState(RESULT_TABS[0].id)
  const [rawReport, setRawReport] = useState('')
  const [report, setReport] = useState(DEFAULT_REPORT)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const scoreBand = useMemo(
    () => report.matchScore,
    [report.matchScore],
  )

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetAnalysis = () => {
    setScreen(SCREENS.INPUT)
    setActiveStep(0)
    setActiveTab(RESULT_TABS[0].id)
    setRawReport('')
    setReport(DEFAULT_REPORT)
    setError('')
    setStatusMessage('')
  }

  const runAnalysis = async () => {
    if (!form.resumeText.trim()) {
      setError('Paste your resume before starting the analysis.')
      return
    }

    setError('')
    setScreen(SCREENS.PROCESSING)
    setActiveStep(0)
    setStatusMessage(PROCESSING_STEPS[0])

    try {
      let enrichedJobDescription = form.jobDescription.trim()

      if (form.jobUrl.trim() && !enrichedJobDescription) {
        const jobPage = await fetchJobPage(form.jobUrl.trim())
        if (jobPage.content) {
          enrichedJobDescription = jobPage.content
        }
      }

      for (let index = 0; index < PROCESSING_STEPS.length; index += 1) {
        setActiveStep(index)
        setStatusMessage(PROCESSING_STEPS[index])
        await wait(350)
      }

      const promptPayload = {
        resumeText: form.resumeText.trim(),
        jobUrl: form.jobUrl.trim(),
        jobDescription: enrichedJobDescription,
        instructions:
          'Return JSON with roleSummary, matchScore, strengths, gaps, actionPlan, keywords, interviewFocus, and fullReport.',
      }

      let responseText = ''

      try {
        if (import.meta.env.VITE_N8N_WEBHOOK_URL) {
          responseText = extractResponseText(await callN8nWebhook(promptPayload))
        } else if (import.meta.env.VITE_CLAUDE_API_URL) {
          responseText = extractResponseText(await callClaude(promptPayload))
        } else {
          responseText = JSON.stringify(buildMockReport({ ...form, jobDescription: enrichedJobDescription }), null, 2)
        }
      } catch (apiError) {
        responseText = JSON.stringify(
          {
            ...buildMockReport({ ...form, jobDescription: enrichedJobDescription }),
            fullReport: `${apiError.message}\n\nFallback report generated locally.`,
          },
          null,
          2,
        )
      }

      const parsed = parseReport(responseText)

      setForm((current) => ({ ...current, jobDescription: enrichedJobDescription }))
      setRawReport(responseText)
      setReport(parsed)
      setActiveTab(RESULT_TABS[0].id)
      setScreen(SCREENS.RESULTS)
    } catch (runError) {
      setError(runError.message || 'Analysis failed. Please try again.')
      setScreen(SCREENS.INPUT)
    }
  }

  return {
    activeStep,
    activeTab,
    error,
    form,
    rawReport,
    report,
    scoreBand,
    screen,
    statusMessage,
    updateField,
    resetAnalysis,
    runAnalysis,
    setActiveTab,
  }
}
