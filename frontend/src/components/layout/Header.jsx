/**
 * components/layout/Header.jsx
 * Sticky top nav — logo, title, dark mode toggle, optional right slot.
 */
const Header = ({ isDark, toggleDark, rightSlot = null }) => (
  <header className="sticky top-0 z-50 flex items-center justify-between px-7 h-14 border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-white/[0.07] dark:bg-[#0B0E17]/90 shrink-0">

    {/* Logo + wordmark */}
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
        </svg>
      </div>

      <span className="font-display text-[15px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Career Coach Navigator
      </span>

      <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
        Beta
      </span>
    </div>

    {/* Right controls */}
    <div className="flex items-center gap-2.5">
      {rightSlot}

      <button
        onClick={toggleDark}
        title="Toggle dark mode"
        className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-sm transition hover:bg-slate-100 dark:border-white/[0.1] dark:bg-white/[0.05] dark:hover:bg-white/[0.09]"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </div>
  </header>
);

export default Header;