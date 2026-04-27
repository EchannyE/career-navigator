/**
 * components/layout/Layout.jsx
 * Full-viewport wrapper — sets background and base font.
 */
const Layout = ({ children }) => (
  <div className="min-h-screen w-full overflow-x-hidden flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#0B0E17] dark:text-slate-100 transition-colors duration-300">
    <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {children}
      </div>
    </main>
  </div>
);

export default Layout;
