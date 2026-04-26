/**
 * api/coachApi.js
 *
 * Separation of Concerns: ALL external network calls live here.
 * Components and hooks never call fetch() directly.
 */

import {
  CLAUDE_MODEL,
  CLAUDE_MAX_TOKENS,
  CORS_PROXY,
  MAX_HTML_LENGTH,
  SCRAPE_TIMEOUT_MS,
} from "../constants/index.js";

// ─── Claude API ───────────────────────────────────────────────────────────────

/**
 * Sends a single prompt to the Claude API and returns the text response.
 *
 * @param {string} system    - System instruction for the model
 * @param {string} userMsg   - The user-turn content
 * @param {number} maxTokens - Max tokens for this call (default from constants)
 * @returns {Promise<string>} Model text response
 * @throws {Error} If the API call fails
 */
export const callClaude = async (
  system,
  userMsg,
  maxTokens = CLAUDE_MAX_TOKENS
) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Claude API error ${response.status}`);
  }

  const data = await response.json();

  if (data.error) throw new Error(data.error.message);

  return data.content[0].text;
};

// ─── Job Page Scraper ─────────────────────────────────────────────────────────

/**
 * Fetches the raw HTML of a job listing URL via a CORS proxy.
 * Returns an empty string on any failure — callers handle the fallback.
 *
 * @param {string} url - The full job listing URL
 * @returns {Promise<string>} Raw HTML or empty string
 */
export const fetchJobPage = async (url) => {
  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, {
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    });

    if (!response.ok) return "";

    const html = await response.text();
    return html.slice(0, MAX_HTML_LENGTH);
  } catch {
    return "";
  }
};

// ─── n8n Webhook (alternative backend) ───────────────────────────────────────

/**
 * Sends the chat message to the n8n Chat Trigger webhook.
 * Use this if you want to run the 3-chain pipeline through n8n
 * instead of calling Claude directly from the browser.
 *
 * @param {string} chatInput - Formatted message with resume + job URL
 * @returns {Promise<Object>} n8n workflow response
 * @throws {Error} If the webhook call fails
 */
export const callN8nWebhook = async (chatInput) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      "VITE_N8N_WEBHOOK_URL is not set. Add it to your .env file."
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatInput }),
  });

  if (!response.ok) {
    throw new Error(`n8n webhook error: HTTP ${response.status}`);
  }

  return response.json();
};
