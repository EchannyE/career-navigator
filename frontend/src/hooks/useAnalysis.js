/**
 * hooks/useAnalysis.js
 */

import { useState, useCallback, useRef } from "react";
import { callN8nWebhook } from "../api/coachApi.js";
import { buildReportFromN8n } from "../utils/reportParser.js";
import {
  SCREENS,
  STEP_STATUS,
  STEP_TIMINGS,
} from "../constants/index.js";

const makeStepStatus = () => ({
  fetch: STEP_STATUS.IDLE,
  chain1: STEP_STATUS.IDLE,
  chain2: STEP_STATUS.IDLE,
  chain3: STEP_STATUS.IDLE,
});

const isValidUrl = (str) => {
  try {
    const { protocol } = new URL(str.trim());
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const useAnalysis = () => {
  const [resume, setResume] = useState("");
  const [resumeMode, setResumeMode] = useState("paste");

  const [jobMode, setJobMode] = useState("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobPaste, setJobPaste] = useState("");

  const [screen, setScreen] = useState(SCREENS.INPUT);
  const [stepStatus, setStepStatus] = useState(makeStepStatus());
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const timersRef = useRef([]);

  const setStep = useCallback((key, status) => {
    setStepStatus((prev) => ({ ...prev, [key]: status }));
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((delay, fn) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const validate = useCallback(() => {
    if (!resume.trim()) {
      return "Please provide your resume — paste it or upload a file.";
    }

    if (resume.trim().length < 30) {
      return "Your resume is too short. Please provide more detail.";
    }

    if (resume.length > 20000) {
      return "Your resume is too long. Please keep it under 20,000 characters.";
    }

    if (jobMode === "url") {
      if (!jobUrl.trim()) {
        return "Please enter a job URL, or switch to Paste Description mode.";
      }

      if (!isValidUrl(jobUrl)) {
        return "Please enter a valid URL starting with http:// or https://";
      }
    }

    if (jobMode === "paste") {
      if (!jobPaste.trim()) {
        return "Please paste the job description before analysing.";
      }

      if (jobPaste.trim().length < 50) {
        return "The job description is too short. Please paste the full job description.";
      }

      if (jobPaste.length > 20000) {
        return "The job description is too long. Please keep it under 20,000 characters.";
      }
    }

    return null;
  }, [resume, jobMode, jobUrl, jobPaste]);

  const startProgressSimulation = useCallback(
    (isPasteMode) => {
      if (isPasteMode) {
        scheduleTimer(300, () => {
          setStep("fetch", STEP_STATUS.DONE);
          setStep("chain1", STEP_STATUS.RUNNING);
        });
      } else {
        scheduleTimer(STEP_TIMINGS.fetch_start, () => {
          setStep("fetch", STEP_STATUS.RUNNING);
        });

        scheduleTimer(STEP_TIMINGS.fetch_done, () => {
          setStep("fetch", STEP_STATUS.DONE);
          setStep("chain1", STEP_STATUS.RUNNING);
        });
      }

      scheduleTimer(STEP_TIMINGS.chain1_done, () => {
        setStep("chain1", STEP_STATUS.DONE);
        setStep("chain2", STEP_STATUS.RUNNING);
      });

      scheduleTimer(STEP_TIMINGS.chain2_done, () => {
        setStep("chain2", STEP_STATUS.DONE);
        setStep("chain3", STEP_STATUS.RUNNING);
      });
    },
    [scheduleTimer, setStep]
  );

  const analyze = useCallback(async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const isPasteMode = jobMode === "paste";

    setError(null);
    setReport(null);
    setStepStatus(makeStepStatus());
    setScreen(SCREENS.PROCESSING);
    startProgressSimulation(isPasteMode);

    try {
      const payload = isPasteMode
        ? {
            resume,
            jobUrl: "",
            jobDescription: jobPaste,
          }
        : {
            resume,
            jobUrl,
            jobDescription: "",
          };

      const n8nData = await callN8nWebhook(payload);

      clearTimers();

      setStep("fetch", STEP_STATUS.DONE);
      setStep("chain1", STEP_STATUS.DONE);
      setStep("chain2", STEP_STATUS.DONE);
      setStep("chain3", STEP_STATUS.DONE);

      const finalReport = buildReportFromN8n(n8nData);

      setReport(finalReport);
      setScreen(SCREENS.RESULTS);
    } catch (err) {
      clearTimers();

      const userMessage =
        err.message === "SERVICE_NOT_CONFIGURED"
          ? "The analysis service is not available. Please contact support."
          : err.message || "Something went wrong during analysis.";

      setError(userMessage);
      setScreen(SCREENS.INPUT);
    }
  }, [
    validate,
    jobMode,
    resume,
    jobUrl,
    jobPaste,
    startProgressSimulation,
    clearTimers,
    setStep,
  ]);

  const reset = useCallback(() => {
    clearTimers();
    setScreen(SCREENS.INPUT);
    setReport(null);
    setError(null);
    setStepStatus(makeStepStatus());
  }, [clearTimers]);

  return {
    resume,
    setResume,
    resumeMode,
    setResumeMode,

    jobMode,
    setJobMode,
    jobUrl,
    setJobUrl,
    jobPaste,
    setJobPaste,

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
