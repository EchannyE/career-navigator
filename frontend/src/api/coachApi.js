/**
 * api/coachApi.js
 *
 * Separation of Concerns: ALL external network calls live here.
 * Components and hooks never call fetch() directly.
 *
 * Backend: n8n Webhook trigger (POST)
 * Workflow: P5 - Career Coach Navigator
 * Model:    gemini-2.5-flash-lite (managed entirely by n8n)
 *
 * WHY TEXT-FIRST PARSING:
 * The n8n "Respond to Webhook" node uses responseBody with a mixed
 * expression format: `=\n={{ $(...).first().json }}\n`
 * When n8n evaluates this as a template string rather than a pure object
 * expression, it may emit the body as a string containing JSON rather than
 * raw JSON — causing response.json() to throw a SyntaxError.
 *
 * Fix: always read the body as text first, then extract and parse JSON
 * using multiple strategies before surfacing any error to the user.
 */

/**
 * Posts { resume, jobUrl } to the n8n Webhook and returns the
 * structured report assembled by the Code Node.
 *
 * n8n reads the body fields via:
 *   {{ $json.body.resume }}
 *   {{ $json.body.jobUrl }}
 *
 * Expected response shape (from Code Node → Respond to Webhook):
 * {
 *   metadata: {
 *     generatedAt: string,   ISO timestamp
 *     jobTitle:    string,
 *     company:     string,
 *     jobUrl:      string,
 *     matchScore:  string    "78%" — string, not a number
 *   },
 *   resumeInput: string,
 *   gapAnalysis: string,     Chain 2 full text output
 *   actionPlan:  string,     Chain 3 full text output
 *   fullReport:  string
 * }
 *
 * @param {string} resume - Candidate plain-text resume
 * @param {string} jobUrl - Full job listing URL for n8n to scrape
 * @returns {Promise<Object>} Parsed report object
 * @throws {Error} User-safe error message on any failure
 */
export const callN8nWebhook = async (resume, jobUrl) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // Config guard — dev-time only sentinel, never shown to users
  if (!webhookUrl) {
    throw new Error("SERVICE_NOT_CONFIGURED");
  }

  // ── 1. Network call ────────────────────────────────────────────────────
  let response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobUrl }),
    });
  } catch {
    throw new Error(
      "Unable to reach the analysis service. Please check your internet connection and try again."
    );
  }

  // ── 2. HTTP error mapping ──────────────────────────────────────────────
  if (!response.ok) {
    throw new Error(resolveHttpError(response.status));
  }

  // ── 3. Read body as text first ─────────────────────────────────────────
  // n8n's Respond to Webhook node may serialize the response body as a
  // template string (e.g. "\n{ ... }\n") rather than sending raw JSON,
  // making response.json() throw a SyntaxError. Reading as text and then
  // parsing manually handles all n8n response serialization edge cases.
  let bodyText;
  try {
    bodyText = await response.text();
  } catch {
    throw new Error(
      "The analysis service returned an empty response. Please try again."
    );
  }

  // ── 4. Parse JSON from body text ───────────────────────────────────────
  const raw = extractJson(bodyText);

  if (!raw) {
    // Log the raw body to the console for developer debugging only —
    // never expose bodyText content in the user-facing error message.
    console.error("[coachApi] Could not parse service response:", bodyText?.slice(0, 300));
    throw new Error(
      "The analysis service returned an unexpected format. Please try again."
    );
  }

  // ── 5. Normalise to consistent shape ───────────────────────────────────
  const data = normaliseResponse(raw);

  if (!data?.metadata || !data?.gapAnalysis || !data?.actionPlan) {
    throw new Error(
      "The analysis could not be completed. Please verify the job URL is publicly accessible and try again."
    );
  }

  return data;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extracts a JSON object from a raw text string using multiple strategies.
 *
 * Handles all known n8n Respond to Webhook output formats:
 *   Strategy 1 — Straight JSON string:   '{"metadata":{...}}'
 *   Strategy 2 — Whitespace-wrapped:     '\n{"metadata":{...}}\n'
 *   Strategy 3 — Embedded in plain text: 'some text {"metadata":{...}} more text'
 *
 * @param {string} text - Raw response body text
 * @returns {*} Parsed value or null if all strategies fail
 */
const extractJson = (text) => {
  if (!text || typeof text !== "string") return null;

  const trimmed = text.trim();
  if (!trimmed) return null;

  // Strategy 1 + 2: direct parse after trimming whitespace
  try {
    return JSON.parse(trimmed);
  } catch {
    // not clean JSON — try extraction
  }

  // Strategy 3: find the first complete JSON object or array in the string
  // Covers cases like: "Result:\n{...}" or n8n adding surrounding text
  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // embedded JSON was also malformed
    }
  }

  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      // embedded array was also malformed
    }
  }

  return null;
};

/**
 * Normalises the parsed response into one consistent object shape,
 * regardless of how n8n wrapped the Code Node output.
 *
 * Handles:
 *   - Array:            [{ metadata, ... }]    → unwrap first item
 *   - n8n item shape:   { json: { metadata } } → unwrap json key
 *   - Direct object:    { metadata, ... }      → return as-is
 *
 * @param {*} raw - Parsed value from extractJson()
 * @returns {Object|null}
 */
const normaliseResponse = (raw) => {
  if (!raw) return null;

  // Case 1: n8n may wrap items in an array
  if (Array.isArray(raw)) {
    const first = raw[0];
    return first?.json || first || null;
  }

  // Case 2: n8n item format with json key
  if (raw.json?.metadata) return raw.json;

  // Case 3: direct object — expected from Respond to Webhook node
  if (raw.metadata) return raw;

  return null;
};

/**
 * Maps HTTP status codes to user-safe messages.
 * No status codes, service names, or stack details are exposed to users.
 *
 * @param {number} status
 * @returns {string}
 */
const resolveHttpError = (status) => {
  if (status === 400)
    return "The request was invalid. Please check your resume and job URL, then try again.";
  if (status === 401 || status === 403)
    return "Access to the analysis service was denied. Please contact support.";
  if (status === 404)
    return "The analysis service could not be found. Please contact support.";
  if (status === 429)
    return "Too many requests — please wait a moment and try again.";
  if (status >= 500)
    return "The analysis service is temporarily unavailable. Please try again in a few minutes.";
  return "Something went wrong during analysis. Please try again.";
};
