/**
 * constants/index.js
 * App-wide constants — aligned with the actual n8n Webhook workflow.
 *
 * Backend: P5 - Career Coach Navigator (n8n)
 * Trigger: Webhook node (POST)
 * Body:    { resume: string, jobUrl: string }
 * Model:   gemini-2.5-flash-lite (via googlePalmApi credential)
 */

// ─── App screens ─────────────────────────────────────────────────────────────
export const SCREENS = {
  INPUT:      "input",
  PROCESSING: "processing",
  RESULTS:    "results",
};

// ─── Processing chain steps (mirrors the actual n8n nodes) ───────────────────
// Progress is SIMULATED on the frontend — n8n is one async webhook call.
export const CHAIN_STEPS = [
  { key: "fetch",  label: "Fetching the job listing page"          },
  { key: "chain1", label: "Extracting job title & requirements"     },
  { key: "chain2", label: "Analysing your resume against the role"  },
  { key: "chain3", label: "Generating your action plan"             },
];

// ─── Step timings for simulated progress (ms) ────────────────────────────────
// Mirrors average n8n execution time (~40–60s total).
export const STEP_TIMINGS = {
  fetch_start:  200,
  fetch_done:   4000,
  chain1_done:  14000,
  chain2_done:  30000,
  // chain3 completes when the real API response arrives
};

// ─── Chain step statuses ──────────────────────────────────────────────────────
export const STEP_STATUS = {
  IDLE:    "idle",
  RUNNING: "running",
  DONE:    "done",
  ERROR:   "error",
};

// ─── Results tabs ─────────────────────────────────────────────────────────────
export const RESULT_TABS = [
  { key: "overview", label: "Overview"     },
  { key: "gaps",     label: "Gap Analysis" },
  { key: "plan",     label: "Action Plan"  },
  { key: "report",   label: "Full Report"  },
];

// ─── Score bands ──────────────────────────────────────────────────────────────
export const SCORE_BANDS = {
  STRONG:  { min: 70, label: "Strong Match",  color: "#10b981" },
  PARTIAL: { min: 45, label: "Partial Match", color: "#f59e0b" },
  WEAK:    { min: 0,  label: "Needs Work",    color: "#ef4444" },
};
