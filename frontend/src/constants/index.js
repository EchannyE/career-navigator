/**
 * constants/index.js
 * App-wide constants — aligned with the actual n8n Webhook workflow.
 *
 * Backend: P5 - Career Coach Navigator (n8n)
 * Trigger: Webhook node (POST)
 *
 * Payload:
 *   URL mode   → { resume: string, jobUrl: string, jobDescription: "" }
 *   Paste mode → { resume: string, jobUrl: "", jobDescription: string }
 *
 * Model: gemini-2.5-flash-lite
 */

// ─── App screens ─────────────────────────────────────────────────────────────

export const SCREENS = {
  INPUT: "input",
  PROCESSING: "processing",
  RESULTS: "results",
};

// ─── Processing chain steps ─────────────────────────────────────────────────

export const CHAIN_STEPS = [
  {
    key: "fetch",
    label: "Preparing job source", // works for both URL + paste
  },
  {
    key: "chain1",
    label: "Extracting job title & requirements",
  },
  {
    key: "chain2",
    label: "Analysing your resume against the role",
  },
  {
    key: "chain3",
    label: "Generating your action plan",
  },
];

// ─── Step timings for simulated progress (ms) ───────────────────────────────

export const STEP_TIMINGS = {
  fetch_start: 200,
  fetch_done: 4000,
  chain1_done: 14000,
  chain2_done: 30000,
  fallback_timeout: 60000, // safety timeout
};

// ─── Chain step statuses ────────────────────────────────────────────────────

export const STEP_STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  DONE: "done",
  ERROR: "error",
};

// ─── Results tabs ───────────────────────────────────────────────────────────

export const RESULT_TABS = [
  { key: "overview", label: "Overview" },
  { key: "gaps", label: "Gap Analysis" },
  { key: "plan", label: "Action Plan" },
  { key: "report", label: "Full Report" },
];

// ─── Score bands ────────────────────────────────────────────────────────────

export const SCORE_BANDS = {
  STRONG: {
    min: 70,
    label: "Strong Match",
    color: "#10b981",
  },

  PARTIAL: {
    min: 45,
    label: "Partial Match",
    color: "#f59e0b",
  },

  WEAK: {
    min: 0,
    label: "Needs Work",
    color: "#ef4444",
  },
};

// ─── Validation limits ──────────────────────────────────────────────────────

export const LIMITS = {
  MAX_RESUME_CHARS: 20000,
  MIN_RESUME_CHARS: 30,

  MAX_JOB_DESCRIPTION_CHARS: 20000,
  MIN_JOB_DESCRIPTION_CHARS: 50,

  MAX_JOB_URL_LENGTH: 500,
};

// ─── Default fallback messages ──────────────────────────────────────────────

export const FALLBACK_TEXT = {
  EMPTY_ANALYSIS: "No analysis available.",
  EMPTY_ACTION_PLAN: "No action plan available.",
  EMPTY_REPORT: "No full report available.",
  UNKNOWN_ROLE: "Unknown Role",
  UNKNOWN_COMPANY: "Unknown Company",

  MISSING_JOB_INPUT:
    "Please provide a job URL or paste a job description to continue.",

  INVALID_URL:
    "Please enter a valid job URL starting with http:// or https://",

  EMPTY_RESUME:
    "Please provide your resume — paste it or upload a file.",
};
