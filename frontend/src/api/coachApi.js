/**
 * api/coachApi.js
 *
 * All external network calls live here.
 * Sends resume + jobUrl/jobDescription to the n8n webhook and returns a normalized report object.
 */

export const callN8nWebhook = async (payload) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("SERVICE_NOT_CONFIGURED");
  }

  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          attempt += 1;
          await wait(2000 * attempt);
          continue;
        }

        throw new Error(resolveHttpError(response.status));
      }

      const bodyText = await response.text();
      const raw = extractJson(bodyText);

      if (!raw) {
        throw new Error("INVALID_JSON");
      }

      const data = normaliseResponse(raw);

      if (!isValidAnalysis(data)) {
        throw new Error("INVALID_ANALYSIS");
      }

      return data;
    } catch (err) {
      attempt += 1;

      const shouldRetry =
        attempt < MAX_RETRIES &&
        (err.name === "AbortError" ||
          err.message === "INVALID_JSON" ||
          err.message === "INVALID_ANALYSIS");

      if (shouldRetry) {
        await wait(1500 * attempt);
        continue;
      }

      if (err.name === "AbortError") {
        throw new Error("The analysis is taking too long. Please try again.");
      }

      if (err.message === "INVALID_JSON") {
        throw new Error(
          "The analysis service returned an unexpected format. Please try again."
        );
      }

      if (err.message === "INVALID_ANALYSIS") {
        throw new Error(
          "The analysis could not be completed. Please ensure the job description is valid."
        );
      }

      throw err;
    }
  }

  throw new Error(
    "The analysis service is temporarily unavailable. Please try again."
  );
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractJson = (text) => {
  if (!text || typeof text !== "string") return null;

  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to fallback extraction
  }

  const obj = trimmed.match(/\{[\s\S]*\}/);
  if (obj) {
    try {
      return JSON.parse(obj[0]);
    } catch {
      // Continue
    }
  }

  const arr = trimmed.match(/\[[\s\S]*\]/);
  if (arr) {
    try {
      return JSON.parse(arr[0]);
    } catch {
      // Continue
    }
  }

  return null;
};

const normaliseResponse = (raw) => {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    const first = raw[0];
    return first?.json || first || null;
  }

  if (raw.json?.metadata) return raw.json;
  if (raw.metadata) return raw;

  return null;
};

const isValidAnalysis = (data) => {
  if (!data) return false;

  if (!data.metadata || !data.fullReport) return false;
  if (!data.gapAnalysis || !data.actionPlan) return false;

  if (data.error || data.success === false) return false;

  const invalidPatterns = [
    /please provide the job description/i,
    /i need the job description/i,
    /missing or invalid job content/i,
    /job page could not be retrieved/i,
    /unable to analyze/i,
  ];

  return !invalidPatterns.some(
    (pattern) =>
      pattern.test(data.gapAnalysis || "") ||
      pattern.test(data.actionPlan || "") ||
      pattern.test(data.fullReport || "")
  );
};

const resolveHttpError = (status) => {
  if (status === 400) {
    return "The request was invalid. Please check your resume and job description, then try again.";
  }

  if (status === 401 || status === 403) {
    return "Access to the analysis service was denied. Please contact support.";
  }

  if (status === 404) {
    return "The analysis service could not be found. Please contact support.";
  }

  if (status === 429) {
    return "Too many requests — please wait a moment and try again.";
  }

  if (status >= 500) {
    return "The analysis service is temporarily unavailable. Please try again in a few minutes.";
  }

  return "Something went wrong during analysis. Please try again.";
};
