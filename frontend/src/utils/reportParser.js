
import { SCORE_BANDS } from "../constants/index.js";

/**
 * Extracts a single-line field value from structured AI text.
 * Handles patterns like "JOB TITLE: Senior Backend Engineer"
 *
 * @param {string} text  - The raw AI response text
 * @param {string} field - The field name to search for
 * @returns {string} Extracted value or "Unknown"
 */
export const extractField = (text, field) => {
  const match = text.match(new RegExp(`${field}:\\s*(.+)`, "i"));
  return match ? match[1].trim().replace(/\*+/g, "") : "Unknown";
};

/**
 * Extracts the numeric match score (0–100) from the gap analysis text.
 *
 * @param {string} text - Chain 2 AI response text
 * @returns {number} Integer match score
 */
export const extractMatchScore = (text) => {
  const match = text.match(/MATCH SCORE:\s*(\d+)/i);
  return match ? Math.min(100, Math.max(0, parseInt(match[1]))) : 0;
};

/**
 * Extracts a bullet-point section from AI text into a string array.
 * Stops at the next all-caps section header.
 *
 * @param {string} text          - Full AI response text
 * @param {string} headerPattern - Regex pattern for the section header
 * @returns {string[]} Array of bullet point strings
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
 * Extracts the overall assessment paragraph from gap analysis text.
 *
 * @param {string} text - Chain 2 AI response text
 * @returns {string} Assessment paragraph
 */
export const extractAssessment = (text) => {
  const match = text.match(
    /OVERALL ASSESSMENT:\s*([\s\S]+?)(?:\n---|$)/i
  );
  return match ? match[1].trim() : "";
};

/**
 * Returns the score band label and color based on the numeric score.
 *
 * @param {number} score - Match score 0–100
 * @returns {{ label: string, color: string }}
 */
export const getScoreBand = (score) => {
  if (score >= SCORE_BANDS.STRONG.min) return SCORE_BANDS.STRONG;
  if (score >= SCORE_BANDS.PARTIAL.min) return SCORE_BANDS.PARTIAL;
  return SCORE_BANDS.WEAK;
};

/**
 * Assembles a complete, structured report object from all 3 chain outputs.
 *
 * @param {Object} params
 * @param {string} params.resume        - Original resume text
 * @param {string} params.jobUrl        - Original job URL
 * @param {string} params.chain1        - Chain 1 output (job extraction)
 * @param {string} params.chain2        - Chain 2 output (gap analysis)
 * @param {string} params.chain3        - Chain 3 output (action plan)
 * @returns {Object} Fully structured report object
 */
export const buildReport = ({ resume, jobUrl, chain1, chain2, chain3 }) => {
  const jobTitle      = extractField(chain1, "JOB TITLE");
  const company       = extractField(chain1, "COMPANY NAME");
  const matchScore    = extractMatchScore(chain2);
  const scoreBand     = getScoreBand(matchScore);
  const matchedSkills = parseBulletSection(chain2, "MATCHED SKILLS");
  const skillGaps     = parseBulletSection(chain2, "SKILL GAPS");
  const expGaps       = parseBulletSection(chain2, "EXPERIENCE GAPS");
  const missingKw     = parseBulletSection(chain2, "MISSING KEYWORDS");
  const assessment    = extractAssessment(chain2);
  const generatedAt   = new Date().toISOString();

  const fullReport =
    `=== CAREER COACH NAVIGATOR REPORT ===\n\n` +
    `Role: ${jobTitle} at ${company}\n` +
    `Match Score: ${matchScore}%\n` +
    `Generated: ${new Date().toLocaleString()}\n\n` +
    `--- GAP ANALYSIS ---\n${chain2}\n\n` +
    `--- ACTION PLAN ---\n${chain3}`;

  return {
    metadata: { generatedAt, jobTitle, company, jobUrl, matchScore, scoreBand },
    resumeInput: resume,
    jobDescription: chain1,
    gapAnalysis: chain2,
    actionPlan: chain3,
    parsed: { matchedSkills, skillGaps, expGaps, missingKw, assessment },
    fullReport,
  };
};
