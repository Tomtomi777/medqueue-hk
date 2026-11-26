
import { useEffect, useState } from "react";

const STORAGE_KEY = "medqueue-theme";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (["light", "dark", "system"].includes(saved)) {
      return saved;
    }
  } catch {
    // Continue if browser storage is unavailable.
  }

  return "system";
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  const [systemDark, setSystemDark] = useState(
    () =>
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    function handleChange(event) {
      setSystemDark(event.matches);
    }

    media.addEventListener("change", handleChange);

    return () =>
      media.removeEventListener("change", handleChange);
  }, []);

  const resolvedTheme =
    theme === "system"
      ? systemDark
        ? "dark"
        : "light"
      : theme;

  useEffect(() => {
    document.documentElement.dataset.theme =
      resolvedTheme;

    document.documentElement.style.colorScheme =
      resolvedTheme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still works without persistent storage.
    }
  }, [theme, resolvedTheme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}
