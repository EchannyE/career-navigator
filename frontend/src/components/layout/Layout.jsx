/**
 * components/layout/Layout.jsx
 * Full-viewport wrapper — sets background and base font.
 */
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#0B0E17] dark:text-slate-100 transition-colors duration-300">
    {children}
  </div>
);

export default Layout;