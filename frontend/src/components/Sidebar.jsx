import { NavLink } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Hospital,
  GitCompareArrows,
  ChartNoAxesCombined,
  ExternalLink,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Hospitals", path: "/hospitals", icon: Hospital },
  { name: "Comparison", path: "/comparison", icon: GitCompareArrows },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Activity size={25} />
        </div>

        <div>
          <h2>MedQueue<span> HK</span></h2>
          <p>Healthcare Analytics</p>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <nav className="navigation">
        {navigation.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="source-info">
          <span className="source-dot"></span>
          Official open data source
        </div>

        <a
          href="https://data.gov.hk/en/"
          target="_blank"
          rel="noopener noreferrer"
          className="source-link"
        >
          DATA.GOV.HK
          <ExternalLink size={13} />
        </a>

        <div className="sidebar-version">
          MedQueue HK
        </div>
      </div>
    </aside>
  );
}
