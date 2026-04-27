/**
 * hooks/useAnalysis.js
 *
 * Separation of Concerns: ALL business logic for the n8n pipeline lives here.
 *
 * Key design decisions aligned with the n8n Webhook workflow:
 *
 * 1. SINGLE API CALL — frontend sends one POST { resume, jobUrl } to the
 *    n8n Webhook node. n8n runs: HTTP scrape → Chain 1 → Chain 2 → Chain 3 → Sheets.
 *
 * 2. SIMULATED PROGRESS — since n8n is a single async call (black box),
 *    the 4-step progress UI is driven by timed intervals. The final step
 *    (chain3) completes when the real API response arrives.
 *
 * 3. URL ONLY — the n8n HTTP Request node scrapes a URL directly.
 *    Paste mode is not supported by this workflow.
 */

import { useState, useCallback, useRef } from "react";
import { callN8nWebhook }     from "../api/coachApi.js";
import { buildReportFromN8n } from "../utils/reportParser.js";
import {
  SCREENS,
  STEP_STATUS,
  STEP_TIMINGS,
} from "../constants/index.js";

// ─── Initial step state ───────────────────────────────────────────────────────
const makeStepStatus = () => ({
  fetch:  STEP_STATUS.IDLE,
  chain1: STEP_STATUS.IDLE,
  chain2: STEP_STATUS.IDLE,
  chain3: STEP_STATUS.IDLE,
});

// ─── URL validator ────────────────────────────────────────────────────────────
const isValidUrl = (str) => {
  try {
    const { protocol } = new URL(str.trim());
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useAnalysis = () => {
  // ── Form inputs ────────────────────────────────────────────────────────
  const [resume, setResume] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  // ── App state ──────────────────────────────────────────────────────────
  const [screen,     setScreen]     = useState(SCREENS.INPUT);
  const [stepStatus, setStepStatus] = useState(makeStepStatus());
  const [report,     setReport]     = useState(null);
  const [error,      setError]      = useState(null);

  // Timer IDs for simulated progress — cleared on completion or error
  const timersRef = useRef([]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const setStep = useCallback((key, status) => {
    setStepStatus((prev) => ({ ...prev, [key]: status }));
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const scheduleTimer = (delay, fn) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  // ── Validation ─────────────────────────────────────────────────────────
  const validate = useCallback(() => {
    if (!resume.trim())
      return "Please paste your resume before analysing.";
    if (!jobUrl.trim())
      return "A job URL is required — the n8n workflow scrapes the page directly.";
    if (!isValidUrl(jobUrl))
      return "Please enter a valid URL starting with http:// or https://";
    return null;
  }, [resume, jobUrl]);

  // ── Simulated progress ─────────────────────────────────────────────────
  // n8n is one async call so we can't track individual steps in real-time.
  // We advance the UI on timers that mirror average n8n execution duration.
  const startProgressSimulation = useCallback(() => {
    scheduleTimer(STEP_TIMINGS.fetch_start, () => {
      setStep("fetch", STEP_STATUS.RUNNING);
    });
    scheduleTimer(STEP_TIMINGS.fetch_done, () => {
      setStep("fetch",  STEP_STATUS.DONE);
      setStep("chain1", STEP_STATUS.RUNNING);
    });
    scheduleTimer(STEP_TIMINGS.chain1_done, () => {
      setStep("chain1", STEP_STATUS.DONE);
      setStep("chain2", STEP_STATUS.RUNNING);
    });
    scheduleTimer(STEP_TIMINGS.chain2_done, () => {
      setStep("chain2", STEP_STATUS.DONE);
      setStep("chain3", STEP_STATUS.RUNNING);
    });
    // chain3 → DONE is set when the real API response arrives (see analyze())
  }, [setStep]);

  // ── Main pipeline ──────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    // Reset state
    setError(null);
    setReport(null);
    setStepStatus(makeStepStatus());
    setScreen(SCREENS.PROCESSING);

    // Start simulated step advancement
    startProgressSimulation();

    try {
      // Single call — n8n runs all 3 chains internally
      // Body: { resume, jobUrl } → n8n Webhook node reads $json.body.resume / $json.body.jobUrl
      const n8nData = await callN8nWebhook(resume, jobUrl);

      // Clear simulated timers — response arrived
      clearTimers();

      // Mark chain3 as done (final step)
      setStep("chain2", STEP_STATUS.DONE); // ensure done if response was fast
      setStep("chain3", STEP_STATUS.DONE);

      // Build the full UI-ready report from the n8n response
      const finalReport = buildReportFromN8n(n8nData);

      setReport(finalReport);
      setScreen(SCREENS.RESULTS);
    } catch (err) {
      clearTimers();
      setError(`Analysis failed: ${err.message}`);
      setScreen(SCREENS.INPUT);
    }
  }, [validate, resume, jobUrl, startProgressSimulation, setStep]);

  // ── Reset ──────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    clearTimers();
    setScreen(SCREENS.INPUT);
    setReport(null);
    setError(null);
    setStepStatus(makeStepStatus());
  }, []);

  return {
    // Form inputs
    resume, setResume,
    jobUrl, setJobUrl,
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
