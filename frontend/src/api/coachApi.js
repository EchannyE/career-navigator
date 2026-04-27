/**
 * api/coachApi.js
 *
 * Separation of Concerns: ALL external network calls live here.
 * Components and hooks never call fetch() directly.
 *
 * Backend: n8n Webhook trigger (regular Webhook node, not Chat Trigger)
 * Workflow: P5 - Career Coach Navigator
 * Model:    gemini-2.5-flash-lite (managed entirely by n8n)
 *
 * The frontend sends a structured JSON body to the n8n Webhook node.
 * n8n reads fields via:
 *   {{ $json.body.resume }}  and  {{ $json.body.jobUrl }}
 *
 * n8n handles internally:
 *   - Scraping the jobUrl (HTTP Request node)
 *   - Chain 1: Job Content Extractor  (Gemini, temp 0.2)
 *   - Chain 2: Gap Analyzer           (Gemini, temp 0.4)
 *   - Chain 3: Action Plan Generator  (Gemini, temp 0.7)
 *   - Code Node: assembles final JSON report
 *   - Google Sheets: appends a log row
 */

/**
 * Posts the resume and job URL to the n8n Webhook and returns the
 * parsed report object assembled by the Code Node.
 *
 * Request body sent to n8n:
 * {
 *   "resume": "<candidate resume text>",
 *   "jobUrl": "https://..."
 * }
 *
 * n8n Code Node response shape:
 * {
 *   metadata: {
 *     generatedAt: string (ISO),
 *     jobTitle:    string,
 *     company:     string,
 *     jobUrl:      string,
 *     matchScore:  string   ← "78%" — string, not a number
 *   },
 *   resumeInput: string,
 *   gapAnalysis: string,    ← Chain 2 full text output
 *   actionPlan:  string,    ← Chain 3 full text output
 *   fullReport:  string
 * }
 *
 * @param {string} resume - Candidate's plain-text resume
 * @param {string} jobUrl - Full job listing URL for n8n to scrape
 * @returns {Promise<Object>} Parsed n8n Code Node output
 * @throws {Error} On network failure, bad HTTP status, or missing fields
 */
export const callN8nWebhook = async (resume, jobUrl) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // ── Config guard — never shown to users; caught during development only ──
  if (!webhookUrl) {
    throw new Error("SERVICE_NOT_CONFIGURED");
  }

  let response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobUrl }),
    });
  } catch {
    // Network failure (offline, DNS error, CORS, timeout)
    throw new Error(
      "Unable to reach the analysis service. Please check your internet connection and try again."
    );
  }

  // Map HTTP error codes to user-friendly messages — no status codes exposed
  if (!response.ok) {
    const userMessage = resolveHttpError(response.status);
    throw new Error(userMessage);
  }

  let raw;
  try {
    raw = await response.json();
  } catch {
    throw new Error(
      "The analysis service returned an unreadable response. Please try again."
    );
  }

  // Normalise the response into a consistent shape
  const data = normaliseResponse(raw);

  if (!data?.metadata || !data?.gapAnalysis || !data?.actionPlan) {
    throw new Error(
      "The analysis could not be completed. Please verify the job URL is publicly accessible and try again."
    );
  }

  return data;
};

/**
 * Maps HTTP status codes to user-friendly messages.
 * Internal codes, service names, and stack details are never exposed.
 *
 * @param {number} status - HTTP response status code
 * @returns {string} User-safe error message
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

/**
 * Normalises various response shapes into one consistent object.
 * Internal implementation details are intentionally absent from this name.
 *
 * Handles:
 *   - Array:           [{ metadata, gapAnalysis, ... }]   → first item
 *   - Nested json key: { json: { metadata, ... } }        → unwrap
 *   - Direct object:   { metadata, gapAnalysis, ... }     → as-is
 *
 * @param {*} raw - Raw parsed JSON from the service response
 * @returns {Object|null}
 */
const normaliseResponse = (raw) => {
  if (!raw) return null;

  // Case 1: n8n wraps output in an array
  if (Array.isArray(raw)) {
    const first = raw[0];
    return first?.json || first || null;
  }

  // Case 2: wrapped in { json: { ... } }
  if (raw.json?.metadata) return raw.json;

  // Case 3: direct object with expected keys
  if (raw.metadata) return raw;

  return null;
};
