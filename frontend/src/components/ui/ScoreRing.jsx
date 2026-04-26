/**
 * components/ui/ScoreRing.jsx
 * Animated SVG circular score ring.
 */
const ScoreRing = ({ score = 0, size = 140 }) => {
  const radius = (size / 2) - 10;
  const circ   = 2 * Math.PI * radius;
  const filled = (score / 100) * circ;

  const color =
    score >= 70 ? "#10b981"
    : score >= 45 ? "#f59e0b"
    : "#ef4444";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth="10"
        className="text-slate-100 dark:text-white/[0.07]"
      />
      {/* Arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* Score */}
      <text x={size / 2} y={size / 2 - 6} textAnchor="middle"
        fill={color} fontSize={size * 0.2} fontWeight="800"
        fontFamily="'Bricolage Grotesque', sans-serif">
        {score}%
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle"
        fill="#94a3b8" fontSize="11" fontFamily="'DM Sans', sans-serif" letterSpacing="1">
        MATCH
      </text>
    </svg>
  );
};

export default ScoreRing;