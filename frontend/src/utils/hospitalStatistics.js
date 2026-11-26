import { formatWaitTime } from "./formatWaitTime";

export function getMedianField(category) {
  return category === "3"
    ? "t3p50Minutes"
    : "t45p50Minutes";
}

export function calculateStatistics(hospitals, category) {
  const field = getMedianField(category);

  const validHospitals = hospitals.filter(
    (hospital) =>
      Number.isFinite(hospital[field]) &&
      hospital[field] >= 0
  );

  if (validHospitals.length === 0) {
    return {
      shortest: null,
      average: null,
      count: 0,
    };
  }

  const shortest = validHospitals.reduce(
    (best, current) =>
      current[field] < best[field] ? current : best
  );

  const total = validHospitals.reduce(
    (sum, hospital) => sum + hospital[field],
    0
  );

  return {
    shortest,
    average: total / validHospitals.length,
    count: validHospitals.length,
  };
}

export function formatMinutes(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) {
    return "Unavailable";
  }

  return formatWaitTime(
    `${Math.round(minutes)} minutes`
  );
}
