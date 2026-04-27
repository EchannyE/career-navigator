export const downloadReport = (content = "", filename) => {
  // Prevent empty downloads
  if (!content || !String(content).trim()) {
    console.warn("No report content available for download.");
    return;
  }

  const safeTimestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-");

  const name =
    filename ||
    `career-coach-report-${safeTimestamp}.txt`;

  const blob = new Blob(
    [String(content)],
    {
      type: "text/plain;charset=utf-8",
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Delay cleanup slightly for browser safety
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

