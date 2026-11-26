
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  RotateCcw,
  X,
  AlertCircle,
  Hospital,
} from "lucide-react";

import HospitalCard from "../components/HospitalCard";
import WaitingTimeGuide from "../components/WaitingTimeGuide";

import { getHospitals } from "../services/hospitalApi";
import { enrichHospitals } from "../utils/hospitalUtils";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("all");

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getHospitals();

      setHospitals(enrichHospitals(data));
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve hospital information.");
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

  const clusters = [
    ...new Set(
      hospitals
        .map((hospital) => hospital.cluster)
        .filter(
          (name) => name && name !== "Unknown"
        )
    ),
  ].sort();

  const query = search.trim().toLowerCase();

  const filteredHospitals = hospitals
    .filter((hospital) => {
      const matchesSearch = [
        hospital.hospitalName,
        hospital.address,
        hospital.cluster,
      ].some((value) =>
        (value ?? "")
          .toLowerCase()
          .includes(query)
      );

      const matchesCluster =
        cluster === "all" ||
        hospital.cluster === cluster;

      return matchesSearch && matchesCluster;
    })
    .sort((a, b) =>
      a.hospitalName.localeCompare(b.hospitalName)
    );

  function resetFilters() {
    setSearch("");
    setCluster("all");
  }

  const hasActiveFilters =
    search !== "" || cluster !== "all";

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

  return (
    <div className="page">

      {/* Page heading */}

      <div className="page-heading">
        <div>
          <div className="eyebrow">
            HONG KONG PUBLIC HEALTH DATA
          </div>

          <h1>Hospital Directory</h1>

          <p>
            Explore A&E departments, locations
            and published waiting times across Hong Kong.
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

      {/* Search and filter controls */}

      <section className="panel directory-filter-panel">

        <div className="panel-heading">
          <div>
            <h2>Find a Hospital</h2>

            <p>
              Search by hospital name, address
              or cluster.
            </p>
          </div>

          <span className="neutral-tag">
            {filteredHospitals.length} hospitals
          </span>
        </div>

        <div className="toolbar">

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
                type="button"
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
            type="button"
            className="reset-filters-button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            <RotateCcw size={15} />
            Reset filters
          </button>

        </div>
      </section>

      {/* Hospital directory */}

      {loading && hospitals.length === 0 ? (
        <div className="panel empty-state">
          Loading hospital information...
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="panel directory-empty">
          <Hospital size={38} />

          <h2>No hospitals found</h2>

          <p>
            {error
              ? "Hospital information is currently unavailable."
              : "Try a different search or reset your filters."}
          </p>

          {hasActiveFilters && (
            <button
              className="primary-button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="directory-grid">

          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.hospitalName}
              hospital={hospital}
            />
          ))}

        </div>
      )}

      <div className="directory-footer">
        Showing {filteredHospitals.length} of{" "}
        {hospitals.length} reporting hospitals.
      </div>

    </div>
  );
}
