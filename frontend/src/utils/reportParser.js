
import { SCORE_BANDS } from "../constants/index.js";

// ─── Field extractors ─────────────────────────────────────────────────────────

/**
 * Parses the matchScore string from n8n metadata ("78%") into an integer.
 * Falls back to 0 if the string can't be parsed.
 *
 * @param {string} matchScoreStr - e.g. "78%"
 * @returns {number} Integer 0–100
 */
export const parseMatchScore = (matchScoreStr = "") => {
  const match = String(matchScoreStr).match(/(\d+)/);
  return match ? Math.min(100, Math.max(0, parseInt(match[1]))) : 0;
};

/**
 * Extracts a bullet-point section from AI text into a clean string array.
 * Stops at the next all-caps section heading or end of string.
 *
 * @param {string} text          - Full AI chain output text
 * @param {string} headerPattern - Regex pattern for the section title
 * @returns {string[]} Array of bullet strings
 */
export const parseBulletSection = (text, headerPattern) => {
  const sectionMatch = text.match(
    new RegExp(`${headerPattern}[:\\s][\\s\\S]*?(?=\\n[A-Z][A-Z\\s]+:|$)`, "i")
  );

  if (!sectionMatch) return [];

  return sectionMatch[0]
    .split("\n")
    .slice(1)
    .map((line) => line.replace(/^[-•*\d.):\s]+/, "").trim())
    .filter((line) => line.length > 2 && !/^[A-Z\s]{5,}:/.test(line));
};

/**
 * Extracts the OVERALL ASSESSMENT paragraph from the gap analysis text.
 *
 * @param {string} text - Chain 2 output
 * @returns {string}
 */
export const extractAssessment = (text) => {
  const match = text.match(/OVERALL ASSESSMENT:\s*([\s\S]+?)(?:\n---|$)/i);
  return match ? match[1].trim() : "";
};

/**
 * Returns the score band (label + color) for a given numeric score.
 *
 * @param {number} score
 * @returns {{ label: string, color: string }}
 */
export const getScoreBand = (score) => {
  if (score >= SCORE_BANDS.STRONG.min)  return SCORE_BANDS.STRONG;
  if (score >= SCORE_BANDS.PARTIAL.min) return SCORE_BANDS.PARTIAL;
  return SCORE_BANDS.WEAK;
};

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Builds a complete, UI-ready report object from the n8n Code Node response.
 *
 * The n8n workflow returns:
 *   { metadata, resumeInput, gapAnalysis, actionPlan, fullReport }
 *
 * This function enriches it with:
 *   - numeric matchScore (parsed from "78%" string)
 *   - scoreBand object
 *   - parsed section arrays (matchedSkills, skillGaps, expGaps, missingKw)
 *   - assessment paragraph
 *
 * @param {Object} n8nData - Raw response from callN8nWebhook()
 * @returns {Object} Fully structured report for the Results dashboard
 */
export const buildReportFromN8n = (n8nData) => {
  const { metadata, resumeInput, gapAnalysis, actionPlan, fullReport } = n8nData;

  // Parse score from "78%" string → integer 78
  const matchScore = parseMatchScore(metadata.matchScore);
  const scoreBand  = getScoreBand(matchScore);

  // Parse the gapAnalysis text into arrays for the Overview tab
  const matchedSkills = parseBulletSection(gapAnalysis, "MATCHED SKILLS");
  const skillGaps     = parseBulletSection(gapAnalysis, "SKILL GAPS");
  const expGaps       = parseBulletSection(gapAnalysis, "EXPERIENCE GAPS");
  const missingKw     = parseBulletSection(gapAnalysis, "MISSING KEYWORDS");
  const assessment    = extractAssessment(gapAnalysis);

  return {
    // Enriched metadata
    metadata: {
      ...metadata,
      matchScore,   // overwrite string with integer
      scoreBand,    // add score band label + color
    },

    // Raw AI outputs (used in text tabs)
    resumeInput,
    gapAnalysis,
    actionPlan,
    fullReport,

    // Parsed data (used in Overview tab + hero card)
    parsed: {
      matchedSkills,
      skillGaps,
      expGaps,
      missingKw,
      assessment,
    },
  };
};
