
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  RefreshCw,
  Search,
  X,
  Plus,
  Hospital,
  GitCompareArrows,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import ComparisonChart from "../components/ComparisonChart";
import WaitingTimeGuide from "../components/WaitingTimeGuide";

import { getHospitals } from "../services/hospitalApi";
import { enrichHospitals } from "../utils/hospitalUtils";
import { formatWaitTime } from "../utils/formatWaitTime";

const MAX_HOSPITALS = 4;

export default function Comparison() {
  // Hospital data

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Comparison controls

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("all");
  const [category, setCategory] = useState("45");

  // Retrieve backend data

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getHospitals();

      setHospitals(enrichHospitals(data));
    } catch (err) {
      console.error(err);

      setError(
        "Unable to retrieve hospital data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHospitals();

    const interval = setInterval(
      loadHospitals,
      60000
    );

    return () => clearInterval(interval);
  }, [loadHospitals]);

  // Available clusters

  const clusters = [
    ...new Set(
      hospitals
        .map((hospital) => hospital.cluster)
        .filter(
          (name) => name && name !== "Unknown"
        )
    ),
  ].sort();

  // Search and filter available hospitals

  const filteredHospitals = hospitals
    .filter((hospital) => {
      const matchesSearch = hospital.hospitalName
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCluster =
        cluster === "all" ||
        hospital.cluster === cluster;

      return matchesSearch && matchesCluster;
    })
    .sort((a, b) =>
      a.hospitalName.localeCompare(b.hospitalName)
    );

  // Preserve the order of selected hospitals

  const selectedHospitals = selected
    .map((name) =>
      hospitals.find(
        (hospital) => hospital.hospitalName === name
      )
    )
    .filter(Boolean);

  // Add or remove a hospital

  function toggleHospital(name) {
    setSelected((previous) => {
      if (previous.includes(name)) {
        return previous.filter(
          (hospitalName) => hospitalName !== name
        );
      }

      if (previous.length >= MAX_HOSPITALS) {
        return previous;
      }

      return [...previous, name];
    });
  }

  function clearSelection() {
    setSelected([]);
  }

  function resetFilters() {
    setSearch("");
    setCluster("all");
  }

  const hasActiveFilters =
    search !== "" || cluster !== "all";

  const selectionLimitReached =
    selected.length >= MAX_HOSPITALS;

  const categoryName =
    category === "3"
      ? "Urgent"
      : "Semi-urgent / Non-urgent";

  // Source timestamp

  const updateTime = hospitals[0]?.sourceUpdateTime;

  const sourceTime = updateTime
    ? updateTime.replace("T", " ").slice(0, 16)
    : "Not available";

  const sourceTimestamp = updateTime
    ? Date.parse(`${updateTime}+08:00`)
    : NaN;

  const dataAge = Date.now() - sourceTimestamp;

  const isFresh =
    Number.isFinite(sourceTimestamp) &&
    dataAge >= 0 &&
    dataAge <= 30 * 60 * 1000;

  const statusText = error
    ? "Connection interrupted"
    : hospitals.length === 0
      ? "Awaiting data"
      : isFresh
        ? "Data current"
        : "Data may be outdated";

  // Comparison table rows

  const comparisonRows = [
    {
      label: "Hospital cluster",
      field: "cluster",
      isTime: false,
    },
    {
      label: "Critical (Category I)",
      field: "t1wt",
      isTime: true,
    },
    {
      label: "Emergency (Category II)",
      field: "t2wt",
      isTime: true,
    },
    {
      label: "Urgent — median",
      field: "t3p50",
      isTime: true,
    },
    {
      label: "Urgent — 95th percentile",
      field: "t3p95",
      isTime: true,
    },
    {
      label: "Less urgent — median",
      field: "t45p50",
      isTime: true,
    },
    {
      label: "Less urgent — 95th percentile",
      field: "t45p95",
      isTime: true,
    },
  ];

  return (
    <div className="page">

      {/* Page heading */}

      <div className="page-heading">
        <div>
          <div className="eyebrow">
            HONG KONG PUBLIC HEALTH DATA
          </div>

          <h1>Hospital Comparison</h1>

          <p>
            Compare published waiting time statistics
            across multiple A&E departments.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={loadHospitals}
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
        <div
          className={`data-status ${
            !error && isFresh
              ? "status-current"
              : "status-warning"
          }`}
        >
          <span className="data-status-dot" />

          {statusText}
        </div>

        <span>Source: Hospital Authority</span>

        <span>
          Source updated: {sourceTime} (HKT)
        </span>
      </div>


      {error && (
        <div className="error-message">
          {error}

          {hospitals.length > 0 &&
            " Showing previously loaded records."}
        </div>
      )}

      <WaitingTimeGuide />

      {/* Hospital selection panel */}

      <section className="panel">

        <div className="panel-heading">
          <div>
            <h2>Select Hospitals</h2>

            <p>
              Choose up to four hospitals
              to compare side by side.
            </p>
          </div>

          <span className="neutral-tag">
            {selected.length}/{MAX_HOSPITALS} selected
          </span>
        </div>

        {/* Selected hospitals */}

        {selected.length > 0 && (
          <div className="selected-hospitals">

            <div className="selected-hospitals-heading">
              <strong>Your selection</strong>

              <button
                className="text-button"
                onClick={clearSelection}
              >
                Clear selection
              </button>
            </div>

            <div className="selected-hospital-tags">

              {selected.map((name, index) => (
                <div
                  className="selected-hospital-tag"
                  key={name}
                >
                  <span className="selected-hospital-id">
                    H{index + 1}
                  </span>

                  <span>{name}</span>

                  <button
                    type="button"
                    onClick={() => toggleHospital(name)}
                    aria-label={`Remove ${name}`}
                    title={`Remove ${name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* Search and cluster filters */}

        <div className="toolbar comparison-toolbar">

          <div className="search-field">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search hospitals..."
              aria-label="Search hospitals"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="clear-search-button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            className="select-field"
            value={cluster}
            aria-label="Filter by hospital cluster"
            onChange={(event) =>
              setCluster(event.target.value)
            }
          >
            <option value="all">
              All hospital clusters
            </option>

            {clusters.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            className="reset-filters-button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            <RotateCcw size={15} />
            Reset filters
          </button>

        </div>

        {selectionLimitReached && (
          <div className="selection-limit-message">
            Maximum of four hospitals selected.
            Remove a hospital to add another.
          </div>
        )}

        {/* Available hospitals */}

        {loading && hospitals.length === 0 ? (
          <div className="empty-state">
            Loading hospitals...
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="empty-state">
            No matching hospitals found.
          </div>
        ) : (
          <div className="hospital-selection-grid">

            {filteredHospitals.map((hospital) => {
              const isSelected = selected.includes(
                hospital.hospitalName
              );

              return (
                <button
                  type="button"
                  key={hospital.hospitalName}
                  className={`hospital-option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    toggleHospital(hospital.hospitalName)
                  }
                  disabled={
                    !isSelected &&
                    selectionLimitReached
                  }
                  aria-pressed={isSelected}
                >
                  <div className="hospital-option-icon">
                    <Hospital size={19} />
                  </div>

                  <div className="hospital-option-info">
                    <strong>
                      {hospital.hospitalName}
                    </strong>

                    <span>
                      {hospital.cluster}
                    </span>
                  </div>

                  <div className="hospital-option-action">
                    {isSelected ? (
                      <X size={17} />
                    ) : (
                      <Plus size={17} />
                    )}
                  </div>
                </button>
              );
            })}

          </div>
        )}

      </section>

      {/* Comparison results */}

      {selectedHospitals.length < 2 ? (
        <section className="panel comparison-empty">

          <div className="comparison-empty-icon">
            <GitCompareArrows size={32} />
          </div>

          <h2>Compare Hospital Waiting Times</h2>

          <p>
            Select at least two hospitals to see
            their waiting time comparison.
          </p>

        </section>
      ) : (
        <section className="panel comparison-results">

          <div className="panel-heading">
            <div>
              <h2>Waiting Time Comparison</h2>

              <p>
                Comparing {selectedHospitals.length} hospitals
              </p>
            </div>

            <span className="neutral-tag">
              {categoryName}
            </span>
          </div>

          {/* Category selector */}

          <div className="comparison-category">

            <span>Chart category</span>

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

          {/* Comparison chart */}

          <ComparisonChart
            hospitals={selectedHospitals}
            category={category}
          />

          <p className="chart-explanation">
            Values are displayed in minutes.
            Missing statistics are omitted.
            Hover over a bar to view its exact value.
          </p>

          {/* Side-by-side comparison table */}

          <div className="comparison-table-section">

            <div className="panel-heading">
              <div>
                <h2>Detailed Comparison</h2>

                <p>
                  All published triage statistics
                </p>
              </div>
            </div>

            <div className="table-wrapper">

              <table className="hospital-table comparison-table">

                <thead>
                  <tr>
                    <th>Metric</th>

                    {selectedHospitals.map(
                      (hospital, index) => (
                        <th key={hospital.hospitalName}>

                          <div className="comparison-column-id">
                            H{index + 1}
                          </div>

                          {hospital.hospitalName}

                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>

                  {comparisonRows.map((row) => (
                    <tr key={row.field}>

                      <td className="comparison-metric">
                        {row.label}
                      </td>

                      {selectedHospitals.map(
                        (hospital) => (
                          <td key={hospital.hospitalName}>
                            {row.isTime
                              ? formatWaitTime(
                                  hospital[row.field]
                                )
                              : hospital[row.field] ??
                                "Unavailable"}
                          </td>
                        )
                      )}

                    </tr>
                  ))}

                </tbody>
              </table>

            </div>

            <p className="table-explanation">
              All values represent the latest
              stored published statistics.
              Individual waiting times may differ.
            </p>

          </div>

        </section>
      )}

    </div>
  );
}
