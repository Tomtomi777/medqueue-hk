
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  RefreshCw,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChartNoAxesCombined,
  Database,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import StatCard from "../components/StatCard";
import HistoryChart from "../components/HistoryChart";
import WaitingTimeGuide from "../components/WaitingTimeGuide";

import {
  getHospitals,
  getHospitalHistory,
} from "../services/hospitalApi";

import {
  prepareHistory,
  filterHistory,
  calculateHistoryStatistics,
  getHistoryFields,
  formatHongKongTime,
} from "../utils/historyUtils";

import {
  formatMinutes,
} from "../utils/hospitalStatistics";

import {
  exportHistoryCsv,
} from "../utils/exportHistory";

export default function Analytics() {
  // Available hospitals

  const [hospitals, setHospitals] = useState([]);
  const [hospitalLoading, setHospitalLoading] =
    useState(true);

  const [hospitalError, setHospitalError] =
    useState("");

  // Historical records

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState("");

  // User controls

  const [selectedHospital, setSelectedHospital] =
    useState("");

  const [category, setCategory] = useState("45");

  const [range, setRange] = useState("24");

  const [refreshVersion, setRefreshVersion] =
    useState(0);

  const [showAllRecords, setShowAllRecords] =
    useState(false);

  // Retrieve available hospitals

  const loadHospitals = useCallback(async () => {
    setHospitalLoading(true);
    setHospitalError("");

    try {
      const data = await getHospitals();

      const sorted = [...data].sort(
        (a, b) =>
          a.hospitalName.localeCompare(
            b.hospitalName
          )
      );

      setHospitals(sorted);

      setSelectedHospital((previous) => {
        if (
          sorted.some(
            (hospital) =>
              hospital.hospitalName === previous
          )
        ) {
          return previous;
        }

        const preferred = sorted.find(
          (hospital) =>
            hospital.hospitalName ===
            "Queen Mary Hospital"
        );

        return (
          preferred?.hospitalName ??
          sorted[0]?.hospitalName ??
          ""
        );
      });
    } catch (err) {
      console.error(err);

      setHospitalError(
        "Unable to retrieve the hospital list."
      );
    } finally {
      setHospitalLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  // Retrieve historical data

  useEffect(() => {
    if (!selectedHospital) {
      return;
    }

    let active = true;

    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError("");

      try {
        const data = await getHospitalHistory(
          selectedHospital
        );

        if (active) {
          setHistory(prepareHistory(data));
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setHistoryError(
            "Unable to retrieve historical records."
          );
        }
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    }

    loadHistory();

    const interval = setInterval(
      loadHistory,
      60000
    );

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedHospital, refreshVersion]);

  // Manual refresh

  function refreshData() {
    loadHospitals();

    setRefreshVersion(
      (previous) => previous + 1
    );
  }

  function changeHospital(name) {
    setHistory([]);
    setHistoryError("");
    setHistoryLoading(true);
    setShowAllRecords(false);
    setSelectedHospital(name);
  }

  // Filter historical records

  const filteredHistory = filterHistory(
    history,
    range
  );

  const statistics =
    calculateHistoryStatistics(
      filteredHistory,
      category
    );

  const fields = getHistoryFields(category);

  const categoryName =
    category === "3"
      ? "Urgent"
      : "Semi-urgent / Non-urgent";

  const rangeName =
    range === "all"
      ? "All collected records"
      : `Last ${range} hours`;

  // Historical change

  const change = statistics.change;

  const changeText =
    change === null
      ? "Insufficient data"
      : change === 0
        ? "No change"
        : `${change > 0 ? "+" : "-"}${formatMinutes(
            Math.abs(change)
          )}`;

  const ChangeIcon =
    change === null || change === 0
      ? Minus
      : change > 0
        ? TrendingUp
        : TrendingDown;

  const changeClass =
    change === null || change === 0
      ? "change-neutral"
      : change > 0
        ? "change-increase"
        : "change-decrease";

  // Display newest records first

  const reversedHistory =
    [...filteredHistory].reverse();

  const visibleRecords = showAllRecords
    ? reversedHistory
    : reversedHistory.slice(0, 10);

  const loading =
    hospitalLoading || historyLoading;

  const firstRecord = filteredHistory[0];

  const lastRecord =
    filteredHistory[filteredHistory.length - 1];

  return (
    <div className="page">

      {/* Page heading */}

      <div className="page-heading">

        <div>
          <div className="eyebrow">
            HONG KONG PUBLIC HEALTH DATA
          </div>

          <h1>Historical Analytics</h1>

          <p>
            Explore changes in published A&E waiting
            times using stored historical records.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={refreshData}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "spinning" : ""}
          />

          Refresh
        </button>

      </div>

      {/* Source information */}

      <div className="data-information">

        <span>Source: Hospital Authority</span>

        <span>
          Backend collection every 15 min
        </span>

        <span>
          All timestamps in Hong Kong time (HKT)
        </span>

      </div>

      {hospitalError && (
        <div className="error-message">
          {hospitalError}
        </div>
      )}

      <WaitingTimeGuide />

      {/* Analytics controls */}

      <section className="panel analytics-controls">

        <div className="panel-heading">
          <div>
            <h2>Analytics Settings</h2>

            <p>
              Select a hospital, category and time range.
            </p>
          </div>
        </div>

        <div className="analytics-input-grid">

          <div className="analytics-field">

            <label htmlFor="analytics-hospital">
              Hospital
            </label>

            <select
              id="analytics-hospital"
              className="select-field"
              value={selectedHospital}
              disabled={hospitalLoading}
              onChange={(event) =>
                changeHospital(event.target.value)
              }
            >
              {hospitals.length === 0 && (
                <option value="">
                  No hospitals available
                </option>
              )}

              {hospitals.map((hospital) => (
                <option
                  key={hospital.hospitalName}
                  value={hospital.hospitalName}
                >
                  {hospital.hospitalName}
                </option>
              ))}
            </select>

          </div>

          <div className="analytics-field">

            <label htmlFor="analytics-range">
              Time range
            </label>

            <select
              id="analytics-range"
              className="select-field"
              value={range}
              onChange={(event) => {
                setRange(event.target.value);
                setShowAllRecords(false);
              }}
            >
              <option value="1">
                Last hour
              </option>

              <option value="6">
                Last 6 hours
              </option>

              <option value="12">
                Last 12 hours
              </option>

              <option value="24">
                Last 24 hours
              </option>

              <option value="168">
                Last 7 days
              </option>

              <option value="all">
                All collected records
              </option>
            </select>

          </div>

        </div>

        <div className="analytics-category">

          <span>Waiting time category</span>

          <div className="view-switch">

            <button
              className={
                category === "3" ? "active" : ""
              }
              onClick={() => setCategory("3")}
              aria-pressed={category === "3"}
            >
              Urgent
            </button>

            <button
              className={
                category === "45" ? "active" : ""
              }
              onClick={() => setCategory("45")}
              aria-pressed={category === "45"}
            >
              Semi-urgent / Non-urgent
            </button>

          </div>

        </div>

      </section>

      {historyError && (
        <div className="error-message">

          {historyError}

          {history.length > 0 &&
            " Showing previously loaded records."}

        </div>
      )}

      {/* Historical summary cards */}

      <div className="stats-grid">

        <StatCard
          title="Lowest Recorded Median"
          value={formatMinutes(statistics.minimum)}
          subtitle="Minimum within selected time range"
          icon={ArrowDown}
        />

        <StatCard
          title="Highest Recorded Median"
          value={formatMinutes(statistics.maximum)}
          subtitle="Maximum within selected time range"
          icon={ArrowUp}
        />

        <StatCard
          title="Mean Recorded Median"
          value={formatMinutes(statistics.average)}
          subtitle={
            `${statistics.validCount} numerical records`
          }
          icon={ChartNoAxesCombined}
        />

        <StatCard
          title="Recorded Snapshots"
          value={filteredHistory.length}
          subtitle={rangeName}
          icon={Database}
        />

      </div>

      {/* Combined chart and records panel */}

      <section className="panel analytics-results">

        <div className="panel-heading">

          <div>
            <h2>Waiting Time Trends</h2>

            <p>
              {selectedHospital ||
                "Select a hospital"}
              {" · "}
              {categoryName}
            </p>
          </div>

          <span className="neutral-tag">
            {filteredHistory.length} records
          </span>

        </div>

        {firstRecord && lastRecord && (
          <div className="history-period">

            <span>
              Recorded period:{" "}
              {formatHongKongTime(
                firstRecord.timestamp,
                true
              )}
              {" — "}
              {formatHongKongTime(
                lastRecord.timestamp,
                true
              )}
              {" HKT"}
            </span>

          </div>
        )}

        {historyLoading && history.length === 0 ? (
          <div className="empty-state">
            Loading historical records...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="history-empty">

            <ChartNoAxesCombined size={40} />

            <h3>No historical records available</h3>

            <p>
              Try a wider time range or another
              hospital.
            </p>

            <button
              className="location-button"
              onClick={() => setRange("all")}
            >
              Show all collected records
            </button>

          </div>
        ) : (
          <>

            {/* Change summary */}

            <div className="history-change-summary">

              <div>
                <span>Latest available median</span>

                <h3>
                  {formatMinutes(statistics.latest)}
                </h3>
              </div>

              <div>
                <span>Change over selected period</span>

                <h3 className={changeClass}>
                  <ChangeIcon size={20} />
                  {changeText}
                </h3>
              </div>

            </div>

            {/* Historical chart */}

            <HistoryChart
              records={filteredHistory}
              category={category}
            />

            <p className="chart-explanation">
              Waiting times are displayed in minutes.
              Missing numerical values are not
              replaced with zero. Historical values
              are not future predictions.
            </p>

          </>
        )}

        {/* Historical records table */}

        <div className="history-table-section">

          <div className="panel-heading">

            <div>
              <h2>Historical Records</h2>

              <p>
                Stored government data snapshots
              </p>
            </div>

            <button
              className="export-button"
              disabled={filteredHistory.length === 0}
              onClick={() =>
                exportHistoryCsv(
                  filteredHistory,
                  selectedHospital,
                  category
                )
              }
            >
              <Download size={16} />
              Export CSV
            </button>

          </div>

          {visibleRecords.length === 0 ? (
            <div className="empty-state">
              No records to display.
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="hospital-table">

                <thead>
                  <tr>
                    <th>Source update time (HKT)</th>
                    <th>Published median</th>
                    <th>95th percentile</th>
                  </tr>
                </thead>

                <tbody>

                  {visibleRecords.map((record) => (
                    <tr
                      key={
                        record.id ??
                        record.timestamp
                      }
                    >
                      <td>
                        {formatHongKongTime(
                          record.timestamp,
                          true
                        )}
                      </td>

                      <td>
                        <span className="wait-value">
                          {formatMinutes(
                            record[fields.median]
                          )}
                        </span>
                      </td>

                      <td>
                        {formatMinutes(
                          record[fields.p95]
                        )}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          <div className="history-table-footer">

            <span>
              Showing {visibleRecords.length} of{" "}
              {filteredHistory.length} records.
            </span>

            {filteredHistory.length > 10 && (
              <button
                className="text-button"
                onClick={() =>
                  setShowAllRecords(
                    (previous) => !previous
                  )
                }
              >
                {showAllRecords
                  ? "Show fewer records"
                  : "Show all records"}
              </button>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}
