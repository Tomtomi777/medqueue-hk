
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MobileNavigation from "./components/MobileNavigation";
import ScrollToTop from "./components/ScrollToTop";
import ConnectionStatus from "./components/ConnectionStatus";

import Dashboard from "./pages/Dashboard";
import Hospitals from "./pages/Hospitals";
import Comparison from "./pages/Comparison";
import Analytics from "./pages/Analytics";

import useTheme from "./hooks/useTheme";

import "./App.css";
import "./styles/theme.css";
import "./styles/mobile.css";
import "./styles/pwa.css";

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <BrowserRouter>

      <ScrollToTop />

      <div className="app-layout">

        <Sidebar />

        <div className="main-layout">

          <Header
            theme={theme}
            onThemeChange={setTheme}
          />

          <ConnectionStatus />

          <main className="main-content">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/hospitals"
                element={<Hospitals />}
              />

              <Route
                path="/comparison"
                element={<Comparison />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>

          </main>

        </div>

        <MobileNavigation />

      </div>

    </BrowserRouter>
  );
}
