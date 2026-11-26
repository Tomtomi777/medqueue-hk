
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Hospital,
  Clock3,
  RefreshCw,
  Search,
  AlertCircle,
  Navigation,
  ChartNoAxesCombined,
  MapPin,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";

import StatCard from "../components/StatCard";
import HospitalTable from "../components/HospitalTable";
import HospitalMap from "../components/HospitalMap";
import WaitingTimeGuide from "../components/WaitingTimeGuide";

import { getHospitals } from "../services/hospitalApi";
import { enrichHospitals } from "../utils/hospitalUtils";

import {
  calculateStatistics,
  formatMinutes,
  getMedianField,
} from "../utils/hospitalStatistics";

import {
  findNearestHospital,
} from "../utils/geoUtils";

export default function Dashboard() {
  // Hospital data state

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filtering state

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [cluster, setCluster] = useState("all");
  const [category, setCategory] = useState("45");

  // Geolocation state

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] =
    useState(false);
  const [locationError, setLocationError] =
    useState("");

  const [focusTarget, setFocusTarget] = useState(null);

  // Retrieve the latest backend records

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getHospitals();

      setHospitals(enrichHospitals(data));
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve hospital data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatic frontend refresh

  useEffect(() => {
    loadHospitals();

    const interval = setInterval(
      loadHospitals,
      60000
    );

    return () => clearInterval(interval);
  }, [loadHospitals]);

  // Request the user's location

  function requestLocation() {
    setLocationError("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by this browser."
      );

      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLocationLoading(false);
      },

      (err) => {
        const messages = {
          1: "Location permission was denied.",
          2: "Your location could not be determined.",
          3: "The location request timed out.",
        };

        setLocationError(
          messages[err.code] ||
            "Unable to access your location."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  // Clear the user's location

  function clearLocation() {
    setUserLocation(null);
    setLocationError("");
    setFocusTarget(null);
  }

  // Reset all hospital filters

  function resetFilters() {
    setSearch("");
    setCluster("all");
    setSort("name");
  }

  const hasActiveFilters =
    search !== "" ||
    cluster !== "all" ||
    sort !== "name";

  // Retrieve available hospital clusters

  const clusters = [
    ...new Set(
      hospitals
        .map((hospital) => hospital.cluster)
        .filter(
          (name) => name && name !== "Unknown"
        )
    ),
  ].sort();

  // Determine the selected waiting time field

  const medianField = getMedianField(category);

  // Search, filter and sort hospitals

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
    .sort((a, b) => {
      if (sort === "name") {
        return a.hospitalName.localeCompare(
          b.hospitalName
        );
      }

      const aValue = Number.isFinite(a[medianField])
        ? a[medianField]
        : Infinity;

      const bValue = Number.isFinite(b[medianField])
        ? b[medianField]
        : Infinity;

      if (aValue === bValue) {
        return a.hospitalName.localeCompare(
          b.hospitalName
        );
      }

      return aValue - bValue;
    });

  // Calculate dashboard statistics

  const statistics = calculateStatistics(
    hospitals,
    category
  );

  // Find the nearest mapped hospital

  const nearestHospital = findNearestHospital(
    hospitals,
    userLocation
  );

  const outsideCoverage =
    nearestHospital &&
    nearestHospital.distance > 100;

  const localNearest = outsideCoverage
    ? null
    : nearestHospital;

  // Government source timestamp

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

  // Data freshness indicator

  const statusText = error
    ? hospitals.length > 0
      ? "Connection interrupted"
      : "Data unavailable"
    : hospitals.length === 0
      ? "Awaiting data"
      : isFresh
        ? "Data current"
        : "Data may be outdated";

  const statusClass =
    !error && isFresh && hospitals.length > 0
      ? "status-current"
      : "status-warning";

  // Human-friendly category name

  const categoryName =
    category === "3"
      ? "Urgent"
      : "Semi-urgent / Non-urgent";

  // Focus the map on the nearest hospital

  function viewNearestOnMap() {
    if (!localNearest) return;

    setSearch("");
    setCluster("all");

    setFocusTarget({
      latitude: localNearest.latitude,
      longitude: localNearest.longitude,
    });

    document
      .getElementById("hospital-map-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <div className="page">

      {/* Page heading */}

      <div className="page-heading">
        <div>
          <div className="eyebrow">
            HONG KONG PUBLIC HEALTH DATA
          </div>

          <h1>A&E Overview</h1>

          <p>
            Explore published waiting time statistics
            across Hong Kong.
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


        <div className="overview-toolbar">
        <div>
            <h2>Overview</h2>
            <p>Published waiting time statistics</p>
        </div>

        <select
            className="select-field overview-category"
            value={category}
            onChange={(event) =>
            setCategory(event.target.value)
            }
            aria-label="Waiting time category"
        >
            <option value="3">
            Urgent
            </option>

            <option value="45">
            Less urgent
            </option>
        </select>
        </div>


      {/* Dashboard summary cards */}

      <div className="stats-grid">

        <StatCard
          title="Reporting Hospitals"
          value={
            loading && hospitals.length === 0
              ? "—"
              : hospitals.length
          }
          subtitle="Hospitals in the latest stored dataset"
          icon={Hospital}
        />

        <StatCard
          title="Shortest Published Median"
          value={
            statistics.shortest
              ? formatMinutes(
                  statistics.shortest[medianField]
                )
              : "—"
          }
          subtitle={
            statistics.shortest
              ? `${statistics.shortest.hospitalName} · ${categoryName}`
              : "Waiting time unavailable"
          }
          icon={Clock3}
        />

        <StatCard
          title="Mean Hospital Median"
          value={
            statistics.average !== null
              ? formatMinutes(statistics.average)
              : "—"
          }
          subtitle={
            `${categoryName} · ${statistics.count} hospitals`
          }
          icon={ChartNoAxesCombined}
        />

        <StatCard
          title="Nearest A&E"
          value={
            locationLoading
              ? "Locating..."
              : outsideCoverage
                ? "Outside area"
                : localNearest
                  ? `${localNearest.distance.toFixed(1)} km`
                  : userLocation
                    ? "Unavailable"
                    : "Find nearest"
          }
          subtitle={
            outsideCoverage
              ? "You are outside our supported area"
              : localNearest
                ? `${localNearest.hospitalName} · Straight-line distance`
                : userLocation
                  ? "No mapped hospital available"
                  : "Enable location to find a mapped hospital"
          }
          icon={Navigation}
        >
          {!userLocation ? (
            <button
              className="location-button"
              onClick={requestLocation}
              disabled={locationLoading}
            >
              <MapPin size={15} />

              {locationLoading
                ? "Finding location..."
                : "Enable location"}
            </button>
          ) : (
            <div className="location-actions">

              {localNearest && (
                <button
                  className="location-button"
                  onClick={viewNearestOnMap}
                >
                  <MapPin size={15} />
                  View on map
                </button>
              )}

              <button
                className="text-button"
                onClick={clearLocation}
              >
                Clear location
              </button>

            </div>
          )}

          {locationError && (
            <p className="location-error">
              {locationError}
            </p>
          )}
        </StatCard>

      </div>


      {/* Backend error message */}

      {error && (
        <div className="error-message">
          {error}

          {hospitals.length > 0 &&
            " Showing previously loaded records."}
        </div>
      )}

      {/* Expandable waiting time guide */}

      <WaitingTimeGuide />

      {/* Unified hospital exploration panel */}

      <section className="panel explore-panel">

        <div className="panel-heading">
          <div>
            <h2>Explore Hospitals</h2>

            <p>
              Search, locate and explore A&E
              departments across Hong Kong.
            </p>
          </div>

          <span className="neutral-tag">
            {filteredHospitals.length} hospitals
          </span>
        </div>

        {/* Search and filters */}

        <div className="explore-filters">

          <div className="filter-heading">
            <Filter size={17} />
            <strong>Search and filter</strong>
          </div>

          <div className="toolbar">

            {/* Hospital search */}

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

            {/* Hospital cluster filter */}

            <select
              className="select-field"
              aria-label="Filter by hospital cluster"
              value={cluster}
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

            {/* Sorting */}

            <select
              className="select-field"
              aria-label="Sort hospitals"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="name">
                Sort: Name (A–Z)
                </option>

                <option value="shortest">
                Sort: Shortest median
                </option>
            </select>

            {/* Reset filters */}

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
        </div>

        {/* Hospital map */}

        <div
          className="explore-map-section"
          id="hospital-map-section"
        >
          <HospitalMap
            hospitals={filteredHospitals}
            category={category}
            userLocation={
              outsideCoverage ? null : userLocation
            }
            nearestHospital={localNearest}
            focusTarget={focusTarget}
          />
        </div>

        {/* Hospital waiting time table */}

        <div className="explore-table-section">

          <div className="panel-heading">
            <div>
              <h2>Hospital Waiting Times</h2>

              <p>
                Latest published statistics
              </p>
            </div>
          </div>

          {loading && hospitals.length === 0 ? (
            <div className="empty-state">
              Loading hospital data...
            </div>
          ) : (
            <HospitalTable
              hospitals={filteredHospitals}
            />
          )}

          <div className="table-footer">
            Showing {filteredHospitals.length} of{" "}
            {hospitals.length} hospitals.
          </div>

        </div>

      </section>

    </div>
  );
}
