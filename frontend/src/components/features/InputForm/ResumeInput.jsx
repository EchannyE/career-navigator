/**
 * components/features/InputForm/ResumeInput.jsx
 */

import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

import Card from "../../ui/Card.jsx";
import SectionLabel from "../../ui/SectionLabel.jsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const MAX_CHARS = 20_000;
const ACCEPTED_TYPES = ".txt,.pdf,.doc,.docx";

const readTxtFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target.result || "");
    reader.onerror = () => reject(new Error("Could not read the text file."));

    reader.readAsText(file, "utf-8");
  });

const readPdfFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    text += `${pageText}\n\n`;
  }

  return text;
};

const readDocxFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return result.value || "";
};

const extractResumeText = async (file) => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".txt")) {
    return readTxtFile(file);
  }

  if (fileName.endsWith(".pdf")) {
    return readPdfFile(file);
  }

  if (fileName.endsWith(".docx")) {
    return readDocxFile(file);
  }

  throw new Error("Unsupported file type. Please upload .txt, .pdf, or .docx.");
};

const ResumeInput = ({ value = "", onChange, resumeMode, onModeChange }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const isPaste = resumeMode === "paste";
  const isUpload = resumeMode === "upload";
  const pct = Math.round((value.length / MAX_CHARS) * 100);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setFileName(file.name);
    setIsReading(true);

    try {
      const text = await extractResumeText(file);
      const cleaned = text.replace(/\s{3,}/g, " ").trim();

      if (!cleaned) {
        throw new Error("No readable text was found in this file.");
      }

      onChange(cleaned.slice(0, MAX_CHARS));
    } catch (error) {
      setUploadError(
        error.message || "Could not read this file. Please try another format."
      );
      onChange("");
    } finally {
      setIsReading(false);
      e.target.value = "";
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <SectionLabel className="mb-0">My Resume</SectionLabel>

        <span
          className={`text-xs font-mono tabular-nums ${
            pct >= 90
              ? "text-red-500"
              : pct >= 70
              ? "text-amber-500"
              : "text-slate-400"
          }`}
        >
          {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        {[
          { mode: "paste", label: "✏️ Paste Text" },
          { mode: "upload", label: "📎 Upload File" },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              resumeMode === mode
                ? "bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/40"
                : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isPaste && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          maxLength={MAX_CHARS}
          placeholder={`Paste your resume here…

Name, title, years of experience.
Skills: Node.js, React, MongoDB, REST APIs…
Projects: ScoreFlow AI, Objective Lens…
Education: B.Sc Computer Science`}
          className="field font-mono text-xs leading-relaxed resize-y min-h-[240px]"
        />
      )}

      {isUpload && (
        <div className="flex flex-col gap-3">
          <div
            onClick={() => !isReading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl
              border-2 border-dashed border-slate-200 dark:border-white/[0.1]
              bg-slate-50 dark:bg-white/[0.02]
              min-h-[110px] cursor-pointer transition
              hover:border-blue-400 hover:bg-blue-50/40
              dark:hover:border-blue-500/40 dark:hover:bg-blue-500/[0.05]
              ${isReading ? "opacity-70 pointer-events-none" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-xl">
              {isReading ? "⏳" : "📄"}
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isReading ? "Extracting resume text..." : "Click to upload your resume"}
              </p>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                .txt · .pdf · .docx
              </p>

              {fileName && (
                <p className="text-xs text-blue-500 mt-1 font-medium">
                  {fileName}
                </p>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFile}
            className="hidden"
          />

          {uploadError && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
              {uploadError}
            </p>
          )}

          {value && (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
              maxLength={MAX_CHARS}
              className="field font-mono text-xs leading-relaxed resize-y min-h-[140px]"
              placeholder="Extracted resume text will appear here. You can edit it before analysing."
            />
          )}

          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            <strong>Tip:</strong> PDF and DOCX files are converted to plain text.
            Scanned image PDFs may not work because they need OCR.
          </p>
        </div>
      )}

      <div className="mt-3 h-1 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-500"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </Card>
  );
};

export default ResumeInput;
