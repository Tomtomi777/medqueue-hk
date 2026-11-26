
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Hospital,
  GitCompareArrows,
  ChartNoAxesCombined,
} from "lucide-react";

const navigation = [
  {
    name: "Home",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Hospitals",
    path: "/hospitals",
    icon: Hospital,
  },
  {
    name: "Compare",
    path: "/comparison",
    icon: GitCompareArrows,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
];

export default function MobileNavigation() {
  return (
    <nav
      className="mobile-navigation"
      aria-label="Mobile navigation"
    >
      {navigation.map(
        ({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `mobile-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Icon size={21} />
            <span>{name}</span>
          </NavLink>
        )
      )}
    </nav>
  );
}
