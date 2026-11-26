
import {
  useLocation,
  Link,
} from "react-router-dom";

import {
  Globe2,
  Activity,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

const pageNames = {
  "/": "Dashboard",
  "/hospitals": "Hospitals",
  "/comparison": "Comparison",
  "/analytics": "Analytics",
};

export default function Header({
  theme,
  onThemeChange,
}) {
  const location = useLocation();

  return (
    <header className="top-header">

      {/* Desktop header */}

      <div className="breadcrumb">
        <span>Workspace</span>
        <span>/</span>

        <strong>
          {pageNames[location.pathname] ||
            "Dashboard"}
        </strong>
      </div>

      {/* Mobile branding */}

      <Link
        to="/"
        className="mobile-brand"
        aria-label="MedQueue HK home"
      >
        <div className="mobile-brand-icon">
          <Activity size={20} />
        </div>

        <div>
          <strong>
            MedQueue<span> HK</span>
          </strong>

          <p>Healthcare Analytics</p>
        </div>
      </Link>

      {/* Shared appearance controls */}

      <div className="header-actions">

        <div className="header-right">
          <Globe2 size={17} />
          <span>Hong Kong SAR</span>
        </div>

        <ThemeToggle
          theme={theme}
          onChange={onThemeChange}
        />

      </div>

    </header>
  );
}
