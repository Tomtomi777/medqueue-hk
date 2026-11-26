
import {
  Sun,
  Moon,
  Monitor,
  Smartphone,
} from "lucide-react";

export default function ThemeToggle({
  theme,
  onChange,
}) {
  return (
    <div
      className="theme-toggle"
      role="group"
      aria-label="Appearance"
    >
      <button
        type="button"
        className={theme === "light" ? "active" : ""}
        onClick={() => onChange("light")}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        title="Light mode"
      >
        <Sun size={17} />
      </button>

      <button
        type="button"
        className={theme === "dark" ? "active" : ""}
        onClick={() => onChange("dark")}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        title="Dark mode"
      >
        <Moon size={17} />
      </button>

      <button
        type="button"
        className={theme === "system" ? "active" : ""}
        onClick={() => onChange("system")}
        aria-label="Follow device appearance"
        aria-pressed={theme === "system"}
        title="Follow device appearance"
      >
        <Monitor
          size={17}
          className="desktop-system-icon"
        />

        <Smartphone
          size={17}
          className="mobile-system-icon"
        />
      </button>
    </div>
  );
}
