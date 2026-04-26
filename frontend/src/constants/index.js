// ─── App screens ─────────────────────────────────────────────────────────────
export const SCREENS = {
  INPUT:      "input",
  PROCESSING: "processing",
  RESULTS:    "results",
};

// ─── Processing chain steps ───────────────────────────────────────────────────
export const CHAIN_STEPS = [
  { key: "fetch",  label: "Reading the job page" },
  { key: "chain1", label: "Extracting job requirements" },
  { key: "chain2", label: "Comparing resume against the role" },
  { key: "chain3", label: "Generating your action plan" },
];

// ─── Chain step statuses ──────────────────────────────────────────────────────
export const STEP_STATUS = {
  IDLE:    "idle",
  RUNNING: "running",
  DONE:    "done",
  ERROR:   "error",
};

// ─── Results tabs ─────────────────────────────────────────────────────────────
export const RESULT_TABS = [
  { key: "overview",   label: "Overview" },
  { key: "gaps",       label: "Gap Analysis" },
  { key: "plan",       label: "Action Plan" },
  { key: "report",     label: "Full Report" },
];

// ─── Score thresholds ─────────────────────────────────────────────────────────
export const SCORE_BANDS = {
  STRONG: { min: 70, label: "Strong Match",   color: "var(--green)" },
  PARTIAL: { min: 45, label: "Partial Match", color: "var(--amber)" },
  WEAK:    { min: 0,  label: "Needs Work",    color: "var(--red)"   },
};

// ─── Claude model (used in API layer) ────────────────────────────────────────
export const CLAUDE_MODEL = "claude-sonnet-4-20250514";
export const CLAUDE_MAX_TOKENS = 2000;

// ─── CORS proxy for job page scraping (browser-side) ─────────────────────────
export const CORS_PROXY = "https://api.allorigins.win/raw?url=";
export const MAX_HTML_LENGTH = 25_000;
export const SCRAPE_TIMEOUT_MS = 15_000;
