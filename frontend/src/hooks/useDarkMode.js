/**
 * hooks/useDarkMode.js
 * Toggles the `dark` class on <html> for Tailwind's class-based dark mode.
 */
import { useState, useEffect } from "react";

const STORAGE_KEY = "ccn-theme";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Safe check for SSR / build environments
    if (typeof window === "undefined") return false;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored !== null) {
        return stored === "dark";
      }

      return window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        isDark ? "dark" : "light"
      );
    } catch {
      // fail silently if storage is unavailable
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  return {
    isDark,
    toggleDark,
  };
};

export default useDarkMode;
