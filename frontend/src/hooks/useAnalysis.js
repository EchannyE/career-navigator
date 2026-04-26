

import { useState, useCallback } from "react";
import { callClaude, fetchJobPage } from "../api/coachApi.js";
import { buildReport } from "../utils/reportParser.js";
import { SCREENS, STEP_STATUS } from "../constants/index.js";

// ─── Initial state factories ──────────────────────────────────────────────────
const makeStepStatus = () => ({
  fetch:  STEP_STATUS.IDLE,
  chain1: STEP_STATUS.IDLE,
  chain2: STEP_STATUS.IDLE,
  chain3: STEP_STATUS.IDLE,
});

// ─── Prompt builders ──────────────────────────────────────────────────────────
const buildChain1Prompt = (rawContent) =>
  `You are a precise web content extractor.

Extract ONLY this structured information:
1. JOB TITLE: The exact role title
2. COMPANY NAME: The company name
3. JOB DESCRIPTION: Full cleaned text — responsibilities, requirements, preferred qualifications, tools/technologies.

Remove ALL HTML tags, navigation, cookie notices, ads, footers.
If content is empty or behind a login wall, respond ONLY with:
"PAGE_ERROR: The job page could not be retrieved. Please paste the job description directly."

Return only the 3 structured fields. No commentary.

RAW CONTENT:
${rawContent || "NO CONTENT RETRIEVED"}`;

const buildChain2Prompt = (resume, jobDescription) =>
  `You are an expert Career Coach and Technical Recruiter with 15 years of experience.

Perform a thorough, honest gap analysis. Return in EXACTLY this format:

MATCH SCORE: [0-100]%

MATCHED SKILLS:
- [Each matching skill or qualification]

SKILL GAPS:
- [Each required skill the candidate is missing]

EXPERIENCE GAPS:
- [Experience level or domain gaps]

MISSING KEYWORDS:
- [Specific technical keywords from the job not in the resume]

OVERALL ASSESSMENT:
[2-3 honest, constructive sentences about candidate fit]

---

CANDIDATE RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}`;

const buildChain3Prompt = (gapAnalysis) =>
  `You are an expert Career Coach creating actionable learning plans.

Generate a clear, motivating learning plan in EXACTLY this format:

ACTION PLAN - PRIORITY SKILLS TO LEARN:

HIGH PRIORITY (Learn these first):
1. [Skill name]
   - Why it matters: [1 sentence]
   - How to learn it: [Specific free resource]
   - Estimated time: [e.g., 2 weeks]

MEDIUM PRIORITY (Important but not blocking):
1. [Skill name]
   - Why it matters: [1 sentence]
   - How to learn it: [Specific resource]
   - Estimated time: [timeframe]

QUICK WINS (Add to your resume this week):
- [Things the candidate can add quickly]

RESUME IMPROVEMENT TIPS:
- [2-3 specific tips for this exact role]

ENCOURAGEMENT:
[1-2 sentences of genuine encouragement based on candidate strengths]

---

GAP ANALYSIS:
${gapAnalysis}`;

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useAnalysis = () => {
  // ── Form inputs ────────────────────────────────────────────────────────────
  const [resume,    setResume]    = useState("");
  const [jobUrl,    setJobUrl]    = useState("");
  const [jobPaste,  setJobPaste]  = useState("");
  const [inputMode, setInputMode] = useState("url"); // "url" | "paste"

  // ── App state ──────────────────────────────────────────────────────────────
  const [screen,     setScreen]     = useState(SCREENS.INPUT);
  const [stepStatus, setStepStatus] = useState(makeStepStatus());
  const [report,     setReport]     = useState(null);
  const [error,      setError]      = useState(null);

  // ── Step status helper ─────────────────────────────────────────────────────
  const setStep = useCallback((key, status) => {
    setStepStatus((prev) => ({ ...prev, [key]: status }));
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = useCallback(() => {
    if (!resume.trim())                                return "Resume is required.";
    if (inputMode === "url" && !jobUrl.trim())         return "Please enter a job URL.";
    if (inputMode === "paste" && !jobPaste.trim())     return "Please paste the job description.";
    return null;
  }, [resume, jobUrl, jobPaste, inputMode]);

  // ── Main pipeline orchestrator ─────────────────────────────────────────────
  const analyze = useCallback(async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError(null);
    setReport(null);
    setStepStatus(makeStepStatus());
    setScreen(SCREENS.PROCESSING);

    try {
      // ── Step: Fetch job page HTML ────────────────────────────────────────
      setStep("fetch", STEP_STATUS.RUNNING);
      let rawContent = "";
      if (inputMode === "url") {
        rawContent = await fetchJobPage(jobUrl);
      } else {
        rawContent = jobPaste;
        await new Promise((r) => setTimeout(r, 500)); // UX: brief pause for paste mode
      }
      setStep("fetch", STEP_STATUS.DONE);

      // ── Chain 1: Extract job info ────────────────────────────────────────
      setStep("chain1", STEP_STATUS.RUNNING);
      let chain1 = await callClaude(
        "You are a precise web content extractor.",
        buildChain1Prompt(rawContent),
        1024
      );

      // If scrape failed and user also provided paste text, retry with paste
      if (chain1.includes("PAGE_ERROR") && jobPaste.trim()) {
        chain1 = await callClaude(
          "You are a precise web content extractor.",
          buildChain1Prompt(jobPaste),
          1024
        );
      }
      setStep("chain1", STEP_STATUS.DONE);

      // ── Chain 2: Gap analysis ────────────────────────────────────────────
      setStep("chain2", STEP_STATUS.RUNNING);
      const chain2 = await callClaude(
        "You are an expert Career Coach and Technical Recruiter.",
        buildChain2Prompt(resume, chain1),
        1500
      );
      setStep("chain2", STEP_STATUS.DONE);

      // ── Chain 3: Action plan ─────────────────────────────────────────────
      setStep("chain3", STEP_STATUS.RUNNING);
      const chain3 = await callClaude(
        "You are an expert Career Coach creating actionable learning plans.",
        buildChain3Prompt(chain2),
        2000
      );
      setStep("chain3", STEP_STATUS.DONE);

      // ── Assemble report ──────────────────────────────────────────────────
      const finalReport = buildReport({
        resume,
        jobUrl: inputMode === "url" ? jobUrl : "Manual Input",
        chain1,
        chain2,
        chain3,
      });

      setReport(finalReport);
      setScreen(SCREENS.RESULTS);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
      setScreen(SCREENS.INPUT);
    }
  }, [validate, inputMode, jobUrl, jobPaste, resume, setStep]);

  // ── Reset everything to initial state ─────────────────────────────────────
  const reset = useCallback(() => {
    setScreen(SCREENS.INPUT);
    setReport(null);
    setError(null);
    setStepStatus(makeStepStatus());
  }, []);

  return {
    // Form inputs
    resume, setResume,
    jobUrl, setJobUrl,
    jobPaste, setJobPaste,
    inputMode, setInputMode,
    // App state
    screen,
    stepStatus,
    report,
    error, setError,
    // Actions
    analyze,
    reset,
  };
};

export default useAnalysis;
