
import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ScaleControl,
  Circle,
  useMap,
} from "react-leaflet";

import { formatWaitTime } from "../utils/formatWaitTime";

import "leaflet/dist/leaflet.css";

function MapFocus({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo(
        [target.latitude, target.longitude],
        14,
        { duration: 1.2 }
      );
    }
  }, [map, target]);

  return null;
}

export default function HospitalMap({
  hospitals = [],
  category = "45",
  userLocation = null,
  nearestHospital = null,
  focusTarget = null,
}) {
  const mappedHospitals = hospitals.filter(
    (hospital) =>
      Number.isFinite(hospital.latitude) &&
      Number.isFinite(hospital.longitude)
  );

  return (
    <div className="hospital-map-content">
      <div className="panel-heading">
        <div>
          <h2>Hospital Locations</h2>

          <p>
            {mappedHospitals.length} mapped A&E departments
            across Hong Kong
          </p>
        </div>

        <span className="neutral-tag">
          {category === "3"
            ? "Urgent"
            : "Semi-urgent / Non-urgent"}
        </span>
      </div>

      <MapContainer
        center={[22.35, 114.15]}
        zoom={10}
        minZoom={9}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        keyboard={true}
        zoomSnap={0.5}
        zoomDelta={0.5}
        className="hospital-map"
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ScaleControl position="bottomleft" />

        <MapFocus target={focusTarget} />

        {mappedHospitals.map((hospital) => {
          const isNearest =
            hospital.hospitalName ===
            nearestHospital?.hospitalName;

          return (
            <CircleMarker
              key={hospital.hospitalName}
              center={[
                hospital.latitude,
                hospital.longitude,
              ]}
              radius={isNearest ? 12 : 9}
              pathOptions={{
                color: "#ffffff",
                weight: isNearest ? 3 : 2,
                fillColor: isNearest
                  ? "#7959c6"
                  : "#148f85",
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div className="hospital-popup">
                  <h3>{hospital.hospitalName}</h3>

                  <p className="popup-cluster">
                    {hospital.cluster}
                  </p>

                  <p className="popup-address">
                    {hospital.address}
                  </p>

                  {isNearest && (
                    <p className="nearest-popup-label">
                      Nearest mapped hospital ·{" "}
                      {nearestHospital.distance.toFixed(1)} km
                    </p>
                  )}

                  <div className="popup-divider" />

                  <div className="popup-stat">
                    <span>Published median</span>

                    <strong>
                      {formatWaitTime(
                        category === "3"
                          ? hospital.t3p50
                          : hospital.t45p50
                      )}
                    </strong>
                  </div>

                  <div className="popup-stat">
                    <span>95th percentile</span>

                    <strong>
                      {formatWaitTime(
                        category === "3"
                          ? hospital.t3p95
                          : hospital.t45p95
                      )}
                    </strong>
                  </div>

                  <p className="popup-caption">
                    {category === "3"
                      ? "Urgent · Category III"
                      : "Semi-urgent / Non-urgent · IV–V"}
                  </p>

                  <p className="popup-caption">
                    Published estimates, not personal
                    waiting time guarantees.
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {userLocation && (
          <>
            {Number.isFinite(userLocation.accuracy) && (
              <Circle
                center={[
                  userLocation.latitude,
                  userLocation.longitude,
                ]}
                radius={userLocation.accuracy}
                pathOptions={{
                  color: "#4285f4",
                  fillColor: "#4285f4",
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
            )}

            <CircleMarker
              center={[
                userLocation.latitude,
                userLocation.longitude,
              ]}
              radius={8}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#4285f4",
                fillOpacity: 1,
              }}
            >
              <Popup>Your approximate location</Popup>
            </CircleMarker>
          </>
        )}
      </MapContainer>

      <div className="map-footer">
        <span className="map-legend-dot" />
        A&E hospital

        {userLocation && (
          <>
            <span className="map-legend-dot user-dot" />
            Your location
          </>
        )}

        {nearestHospital && (
          <>
            <span className="map-legend-dot nearest-dot" />
            Nearest mapped hospital
          </>
        )}

        <span className="map-footer-text">
          Click a marker to view hospital information.
        </span>
      </div>
    </div>
  );
}
