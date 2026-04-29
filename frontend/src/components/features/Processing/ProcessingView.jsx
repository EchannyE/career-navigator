import { useState, useEffect, useMemo } from "react";
import { CHAIN_STEPS, STEP_STATUS } from "../../../constants/index.js";

const STEP_MESSAGES = {
  fetch: [
    "Connecting to the job listing…",
    "Reading the job page…",
    "Preparing the job content…",
  ],
  chain1: [
    "Cleaning the job description…",
    "Extracting title, company, and requirements…",
    "Removing page noise and formatting…",
  ],
  chain2: [
    "Comparing your resume with the role…",
    "Checking matched skills and gaps…",
    "Calculating your fit score…",
  ],
  chain3: [
    "Creating your career action plan…",
    "Prioritising learning steps…",
    "Preparing your final coaching report…",
  ],
};

const DEFAULT_MESSAGES = [
  "Starting your career analysis…",
  "Preparing the AI workflow…",
];

const estimateSecondsRemaining = (done, total) => {
  const remaining = total - done;
  if (remaining <= 0) return 0;
  return Math.max(8, remaining * 14);
};

const ProcessingView = ({ stepStatus = {} }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(55);
  const [completedSteps, setCompletedSteps] = useState({});

  const total = CHAIN_STEPS.length;

  const done = useMemo(
    () =>
      CHAIN_STEPS.filter(
        ({ key }) => stepStatus[key] === STEP_STATUS.DONE
      ).length,
    [stepStatus]
  );

  const progress = Math.min(100, Math.round((done / total) * 100));

  const runningKey = CHAIN_STEPS.find(
    ({ key }) => stepStatus[key] === STEP_STATUS.RUNNING
  )?.key;

  const msgPool = runningKey ? STEP_MESSAGES[runningKey] : DEFAULT_MESSAGES;

  useEffect(() => {
    setMsgIndex(0);

    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % msgPool.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [runningKey, msgPool.length]);

  useEffect(() => {
    setSecondsLeft(estimateSecondsRemaining(done, total));

    if (done >= total) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [done, total]);

  useEffect(() => {
    CHAIN_STEPS.forEach(({ key }) => {
      if (stepStatus[key] === STEP_STATUS.DONE) {
        setCompletedSteps((prev) => ({ ...prev, [key]: true }));
      }
    });
  }, [stepStatus]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-5 py-10 bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950">
      <section className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 h-28 w-28">
          <div className="absolute inset-0 rounded-full border border-blue-100 dark:border-blue-400/10" />

          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-violet-500 animate-spin" />

          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-blue-400 border-l-violet-400 animate-[spin_1.6s_linear_infinite_reverse]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-16 w-16 rounded-2xl bg-blue-500/20 blur-xl animate-pulse" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.3 6.8 19.1l1-5.8-4.3-4.1 5.9-.9L12 3z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Analysing your career fit
        </h2>

        <p
          key={`${runningKey}-${msgIndex}`}
          className="mx-auto mb-2 max-w-sm text-sm text-slate-500 dark:text-slate-400 animate-fade-in"
        >
          {msgPool[msgIndex]}
        </p>

        <p className="mb-8 text-xs text-slate-400 dark:text-slate-500">
          {done < total
            ? secondsLeft > 0
              ? `Estimated time remaining: ${secondsLeft}s`
              : "Almost done…"
            : "Finalising your report…"}
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          {CHAIN_STEPS.map(({ key, label }, index) => {
            const status = stepStatus[key];
            const isDone = status === STEP_STATUS.DONE;
            const isRunning = status === STEP_STATUS.RUNNING;
            const isIdle = !isDone && !isRunning;

            return (
              <div
                key={key}
                className={`flex items-center gap-4 border-b border-slate-100 px-5 py-4 text-left last:border-b-0 dark:border-white/[0.06] ${
                  isRunning
                    ? "bg-blue-50/80 dark:bg-blue-500/[0.06]"
                    : isDone
                    ? "bg-emerald-50/60 dark:bg-emerald-500/[0.05]"
                    : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isDone
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : isRunning
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                      : "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <svg
                      className={
                        completedSteps[key]
                          ? "animate-[checkPop_.35s_ease-out_both]"
                          : ""
                      }
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : isRunning ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-current animate-pulse" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      isRunning
                        ? "font-semibold text-blue-700 dark:text-blue-300"
                        : isDone
                        ? "font-medium text-slate-800 dark:text-slate-100"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {label}
                  </p>

                  {isIdle && (
                    <div className="mt-2 h-1.5 w-3/4 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                      <div className="h-full w-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-white/10" />
                    </div>
                  )}
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isDone
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : isRunning
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                      : "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"
                  }`}
                >
                  {isDone ? "Done" : isRunning ? "Running" : "Queued"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Workflow progress</span>
            <span>
              {done}/{total}
            </span>
          </div>

          <div className="relative h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />

            {done < total && (
              <div className="absolute top-0 h-full w-1/3 animate-[shimmerBar_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shimmerBar {
          0% { left: -35%; }
          100% { left: 110%; }
        }

        @keyframes checkPop {
          0% { opacity: 0; transform: scale(0.4); }
          70% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
};

export default ProcessingView;
