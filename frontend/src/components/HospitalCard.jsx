
import { useState } from "react";

import {
  Hospital,
  MapPin,
  Navigation,
  ChevronDown,
  ChevronUp,
  Clock3,
  ExternalLink,
} from "lucide-react";

import { formatWaitTime } from "../utils/formatWaitTime";

export default function HospitalCard({ hospital }) {
  const [expanded, setExpanded] = useState(false);

  const hasLocation =
    Number.isFinite(hospital.latitude) &&
    Number.isFinite(hospital.longitude);

  const directionsUrl = hasLocation
    ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
    : null;

  const statistics = [
    {
      label: "Critical (Category I)",
      value: hospital.t1wt,
    },
    {
      label: "Emergency (Category II)",
      value: hospital.t2wt,
    },
    {
      label: "Urgent — median",
      value: hospital.t3p50,
    },
    {
      label: "Urgent — 95th percentile",
      value: hospital.t3p95,
    },
    {
      label: "Semi-urgent / Non-urgent — median",
      value: hospital.t45p50,
    },
    {
      label: "Semi-urgent / Non-urgent — 95th percentile",
      value: hospital.t45p95,
    },
  ];

  return (
    <article className="directory-card">

      {/* Hospital information */}

      <div className="directory-card-heading">
        <div className="directory-hospital-icon">
          <Hospital size={24} />
        </div>

        <div className="directory-hospital-info">
          <h2>{hospital.hospitalName}</h2>

          <p className="directory-cluster">
            {hospital.cluster}
          </p>

          <div className="directory-address">
            <MapPin size={14} />
            <span>{hospital.address}</span>
          </div>
        </div>
      </div>

      {/* Waiting time summary */}

      <div className="directory-waits">

        <div className="directory-wait urgent">
          <div className="directory-wait-label">
            <Clock3 size={14} />
            Urgent
          </div>

          <strong>
            {formatWaitTime(hospital.t3p50)}
          </strong>

          <span>Published median · Category III</span>
        </div>

        <div className="directory-wait nonurgent">
          <div className="directory-wait-label">
            <Clock3 size={14} />
            Less urgent
          </div>

          <strong>
            {formatWaitTime(hospital.t45p50)}
          </strong>

          <span>Published median · Category IV–V</span>
        </div>

      </div>

      {/* Actions */}

      <div className="directory-actions">
        <button
          type="button"
          className="directory-details-button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "View details"}

          {expanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="directory-directions"
          >
            <Navigation size={14} />
            Directions
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Expanded hospital details */}

      {expanded && (
        <div className="directory-expanded">
          <h3>Published waiting time statistics</h3>

          <div className="directory-statistics">
            {statistics.map((statistic) => (
              <div
                className="directory-statistic-row"
                key={statistic.label}
              >
                <span>{statistic.label}</span>

                <strong>
                  {formatWaitTime(statistic.value)}
                </strong>
              </div>
            ))}
          </div>

          {hasLocation && (
            <div className="directory-coordinates">
              Coordinates:{" "}
              {hospital.latitude.toFixed(5)},{" "}
              {hospital.longitude.toFixed(5)}
            </div>
          )}

          <p className="directory-disclaimer">
            Published estimates are not guaranteed
            individual waiting times. Medical staff
            determine treatment priority.
          </p>
        </div>
      )}

    </article>
  );
}
