
import { useState } from "react";
import { MapPin } from "lucide-react";
import { formatWaitTime } from "../utils/formatWaitTime";

export default function HospitalTable({ hospitals }) {
  const [detailed, setDetailed] = useState(false);

  return (
    <>
      <div className="table-view-toolbar">
        <span className="table-view-label">
          Display mode
        </span>

        <div className="view-switch">
          <button
            className={!detailed ? "active" : ""}
            onClick={() => setDetailed(false)}
            aria-pressed={!detailed}
          >
            Simple view
          </button>

          <button
            className={detailed ? "active" : ""}
            onClick={() => setDetailed(true)}
            aria-pressed={detailed}
          >
            Detailed statistics
          </button>
        </div>
      </div>

      {hospitals.length === 0 ? (
        <div className="empty-state">
          No hospital records found.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Hospital</th>

                {detailed && (
                  <>
                    <th>Critical (I)</th>
                    <th>Emergency (II)</th>
                  </>
                )}

                <th>
                  Urgent
                  <span className="column-subtitle">
                    Category III · Median
                  </span>
                </th>

                {detailed && (
                  <th>
                    Urgent
                    <span className="column-subtitle">
                      95th percentile
                    </span>
                  </th>
                )}

                <th>
                  Semi-urgent / Non-urgent
                  <span className="column-subtitle">
                    Category IV–V · Median
                  </span>
                </th>

                {detailed && (
                  <th>
                    Semi-urgent / Non-urgent
                    <span className="column-subtitle">
                      95th percentile
                    </span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {hospitals.map((hospital) => (
                <tr key={hospital.id}>
                  <td className="hospital-name">
                    <div>{hospital.hospitalName}</div>

                    {hospital.cluster &&
                      hospital.cluster !== "Unknown" && (
                        <div className="hospital-cluster">
                          <MapPin size={12} />
                          {hospital.cluster}
                        </div>
                      )}
                  </td>

                  {detailed && (
                    <>
                      <td>
                        {formatWaitTime(hospital.t1wt)}
                      </td>

                      <td>
                        {formatWaitTime(hospital.t2wt)}
                      </td>
                    </>
                  )}

                  <td>
                    <span className="urgent-value">
                      {formatWaitTime(hospital.t3p50)}
                    </span>
                  </td>

                  {detailed && (
                    <td>
                      {formatWaitTime(hospital.t3p95)}
                    </td>
                  )}

                  <td>
                    <span className="wait-value">
                      {formatWaitTime(hospital.t45p50)}
                    </span>
                  </td>

                  {detailed && (
                    <td>
                      {formatWaitTime(hospital.t45p95)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="table-explanation">
        Waiting times are published estimates.
        Medical urgency determines treatment priority.
      </p>
    </>
  );
}
