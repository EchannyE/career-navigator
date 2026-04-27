
import { CHAIN_STEPS, STEP_STATUS } from "../../../constants/index.js";

const statusConfig = {
  [STEP_STATUS.IDLE]:    { badge: "Queued",  badgeClass: "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500", iconBg: "bg-slate-100 dark:bg-white/[0.05]", icon: null },
  [STEP_STATUS.RUNNING]: { badge: "Running", badgeClass: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",       iconBg: "bg-blue-50 dark:bg-blue-500/10",     icon: "dot" },
  [STEP_STATUS.DONE]:    { badge: "Done",    badgeClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", iconBg: "bg-emerald-50 dark:bg-emerald-500/10", icon: "✓" },
  [STEP_STATUS.ERROR]:   { badge: "Error",   badgeClass: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",            iconBg: "bg-red-50 dark:bg-red-500/10",       icon: "✕" },
};

const ProcessingView = ({ stepStatus }) => {
  const done     = Object.values(stepStatus).filter((s) => s === STEP_STATUS.DONE).length;
  const total    = CHAIN_STEPS.length;
  const progress = Math.round((done / total) * 100);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8 animate-fade-up">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="absolute inset-0">
          <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="5" className="text-slate-100 dark:text-white/[0.07]"/>
          <circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="5"
            strokeDasharray="50 151" strokeLinecap="round"
            transform="rotate(-90 40 40)"
            className="animate-spin-slow" style={{ transformOrigin: "center" }}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2 animate-fade-up delay-1">
        Analyzing your career fit…
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 animate-fade-up delay-2">
        Our AI is running, this will takes about 30–60 seconds
      </p>

      {/* Steps card */}
      <div className="w-full max-w-md card overflow-hidden mb-5 animate-fade-up delay-3">
        {CHAIN_STEPS.map(({ key, label }, i) => {
          const status = stepStatus[key];
          const cfg    = statusConfig[status];

          return (
            <div key={key} className="step-row">
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${cfg.iconBg}`}>
                {cfg.icon === "dot"
                  ? <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse-dot" />
                  : cfg.icon
                    ? <span className={status === STEP_STATUS.DONE ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}>{cfg.icon}</span>
                    : <span className="text-xs text-slate-400">{i + 1}</span>
                }
              </div>

              {/* Label */}
              <span className={`text-sm flex-1 ${
                status === STEP_STATUS.DONE    ? "text-slate-800 dark:text-slate-200 font-medium"
                : status === STEP_STATUS.RUNNING ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-400 dark:text-slate-500"
              }`}>
                {label}
              </span>

              {/* Badge */}
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${cfg.badgeClass}`}>
                {cfg.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-2">
          <span>Progress</span>
          <span>{done} / {total} steps</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.07] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </main>
  );
};

export default ProcessingView;
