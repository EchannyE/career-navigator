
/**
 * hooks/useAnalysis.js
 *
 * Separation of Concerns: ALL business logic for the n8n pipeline lives here.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { callN8nWebhook } from "../api/coachApi.js";
import { buildReportFromN8n } from "../utils/reportParser.js";
import {
  SCREENS,
  STEP_STATUS,
  STEP_TIMINGS,
  LIMITS,
} from "../constants/index.js";

const makeStepStatus = () => ({
  fetch: STEP_STATUS.IDLE,
  chain1: STEP_STATUS.IDLE,
  chain2: STEP_STATUS.IDLE,
  chain3: STEP_STATUS.IDLE,
});

const isValidUrl = (str = "") => {
  try {
    const { protocol } = new URL(str.trim());
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const useAnalysis = () => {
  const [resume, setResume] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [screen, setScreen] = useState(SCREENS.INPUT);
  const [stepStatus, setStepStatus] = useState(makeStepStatus());
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const timersRef = useRef([]);
  const isMountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((delay, fn) => {
    const id = setTimeout(() => {
      if (isMountedRef.current) fn();
    }, delay);

    timersRef.current.push(id);
  }, []);

  const setStep = useCallback((key, status) => {
    setStepStatus((prev) => ({
      ...prev,
      [key]: status,
    }));
  }, []);

  const validate = useCallback(() => {
    const cleanResume = resume.trim();
    const cleanJobUrl = jobUrl.trim();

    if (!cleanResume) {
      return "Please paste your resume before analysing.";
    }

    if (cleanResume.length < LIMITS.MIN_RESUME_CHARS) {
      return `Your resume is too short. Please enter at least ${LIMITS.MIN_RESUME_CHARS} characters.`;
    }

    if (cleanResume.length > LIMITS.MAX_RESUME_CHARS) {
      return `Your resume is too long. Please keep it under ${LIMITS.MAX_RESUME_CHARS.toLocaleString()} characters.`;
    }

    if (!cleanJobUrl) {
      return "A job URL is required — the n8n workflow scrapes the page directly.";
    }

    if (cleanJobUrl.length > LIMITS.MAX_JOB_URL_LENGTH) {
      return `The job URL is too long. Please keep it under ${LIMITS.MAX_JOB_URL_LENGTH} characters.`;
    }

    if (!isValidUrl(cleanJobUrl)) {
      return "Please enter a valid URL starting with http:// or https://";
    }

    return null;
  }, [resume, jobUrl]);

  const startProgressSimulation = useCallback(() => {
    clearTimers();

    scheduleTimer(STEP_TIMINGS.fetch_start, () => {
      setStep("fetch", STEP_STATUS.RUNNING);
    });

    scheduleTimer(STEP_TIMINGS.fetch_done, () => {
      setStep("fetch", STEP_STATUS.DONE);
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
  }, [clearTimers, scheduleTimer, setStep]);

  const analyze = useCallback(async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const cleanResume = resume.trim();
    const cleanJobUrl = jobUrl.trim();

    setError(null);
    setReport(null);
    setStepStatus(makeStepStatus());
    setScreen(SCREENS.PROCESSING);

    startProgressSimulation();

    try {
      const n8nData = await callN8nWebhook(cleanResume, cleanJobUrl);

      clearTimers();

      setStepStatus({
        fetch: STEP_STATUS.DONE,
        chain1: STEP_STATUS.DONE,
        chain2: STEP_STATUS.DONE,
        chain3: STEP_STATUS.DONE,
      });

      const finalReport = buildReportFromN8n(n8nData);

      setReport(finalReport);
      setScreen(SCREENS.RESULTS);
    } catch (err) {
      clearTimers();

      setStepStatus((prev) => ({
        ...prev,
        chain3: STEP_STATUS.ERROR,
      }));

      const userMessage =
        err?.message === "SERVICE_NOT_CONFIGURED"
          ? "The analysis service is not available. Please contact support."
          : err?.message || "Something went wrong while analysing your resume.";

      setError(userMessage);
      setScreen(SCREENS.INPUT);
    }
  }, [validate, resume, jobUrl, startProgressSimulation, clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setScreen(SCREENS.INPUT);
    setReport(null);
    setError(null);
    setStepStatus(makeStepStatus());
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  return {
    resume,
    setResume,
    jobUrl,
    setJobUrl,
    screen,
    stepStatus,
    report,
    error,
    setError,
    analyze,
    reset,
  };
};

export default useAnalysis;
