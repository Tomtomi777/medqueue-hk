
import hospitalLocations from "../data/hospitalLocations.json";

export function normalizeHospitalName(name) {
  return (name ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

export const aeLocations = hospitalLocations
  .filter(
    (hospital) =>
      hospital.with_AE_service_eng === "Yes"
  )
  .filter(
    (hospital) =>
      Number.isFinite(hospital.latitude) &&
      Number.isFinite(hospital.longitude) &&
      Math.abs(hospital.latitude) <= 90 &&
      Math.abs(hospital.longitude) <= 180
  );

export function enrichHospitals(hospitals) {
  const locationMap = new Map(
    aeLocations.map((hospital) => [
      normalizeHospitalName(hospital.institution_eng),
      hospital,
    ])
  );

  return hospitals.map((hospital) => {
    const location = locationMap.get(
      normalizeHospitalName(hospital.hospitalName)
    );

    return {
      ...hospital,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      address: location?.address_eng ?? "Not available",
      cluster: location?.cluster_eng ?? "Unknown",
    };
  });
}
