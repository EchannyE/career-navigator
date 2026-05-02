import { SCORE_BANDS } from "../constants/index.js";

export const parseMatchScore = (matchScoreStr = "") => {
  const match = String(matchScoreStr).match(/(\d+)/);
  const score = match ? Number.parseInt(match[1], 10) : 0;

  return Math.min(100, Math.max(0, score));
};

export const parseBulletSection = (text = "", headerPattern = "") => {
  if (!text || !headerPattern) return [];

  const sectionMatch = String(text).match(
    new RegExp(
      `${headerPattern}\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z\\s]+:|\\n---|$)`,
      "i"
    )
  );

  if (!sectionMatch) return [];

  return sectionMatch[1]
    .split("\n")
    .map((line) => line.replace(/^[-•*▸✓✗\d.):\s]+/, "").trim())
    .filter((line) => line.length > 2 && !/^[A-Z\s]{5,}:$/.test(line));
};

export const extractAssessment = (text = "") => {
  const match = String(text).match(
    /OVERALL ASSESSMENT\s*:?\s*([\s\S]+?)(?=\n[A-Z][A-Z\s]+:|\n---|$)/i
  );

  return match ? match[1].trim() : "";
};

export const getScoreBand = (score = 0) => {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));

  if (safeScore >= SCORE_BANDS.STRONG.min) return SCORE_BANDS.STRONG;
  if (safeScore >= SCORE_BANDS.PARTIAL.min) return SCORE_BANDS.PARTIAL;

  return SCORE_BANDS.WEAK;
};

export const buildReportFromN8n = (n8nData = {}) => {
  const payload = n8nData?.data || n8nData?.json || n8nData || {};

  const {
    metadata = {},
    resumeInput = "",
    jobDescription = "",
    gapAnalysis = "",
    actionPlan = "",
    fullReport = payload.report || "",
  } = payload;

  if (!gapAnalysis && !actionPlan && !fullReport) {
    throw new Error("The analysis service returned an unreadable response.");
  }

  const matchScore = parseMatchScore(metadata.matchScore);
  const scoreBand = getScoreBand(matchScore);

  const matchedSkills = parseBulletSection(gapAnalysis, "MATCHED SKILLS");
  const skillGaps = parseBulletSection(gapAnalysis, "SKILL GAPS");
  const expGaps = parseBulletSection(gapAnalysis, "EXPERIENCE GAPS");
  const missingKw = parseBulletSection(gapAnalysis, "MISSING KEYWORDS");
  const transferableStrengths = parseBulletSection(
    gapAnalysis,
    "TRANSFERABLE STRENGTHS"
  );
  const assessment = extractAssessment(gapAnalysis);

  return {
    metadata: {
      jobTitle: metadata.jobTitle || "Unknown Role",
      company: metadata.company || "Unknown Company",
      generatedAt: metadata.generatedAt || new Date().toISOString(),
      ...metadata,
      matchScore,
      scoreBand,
    },

    resumeInput,
    jobDescription,
    gapAnalysis,
    actionPlan,
    fullReport,

    parsed: {
      matchedSkills,
      skillGaps,
      expGaps,
      missingKw,
      transferableStrengths,
      assessment,
    },
  };
};
