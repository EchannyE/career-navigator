/**
 * hooks/useDarkMode.js
 * Toggles the `dark` class on <html> for Tailwind's class-based dark mode.
 */
import { useState, useEffect } from "react";

const STORAGE_KEY = "ccn-theme";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);
  return { isDark, toggleDark };
};

export default useDarkMode;