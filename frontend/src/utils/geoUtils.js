const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) ** 2;

  const safeA = Math.min(1, Math.max(0, a));

  const c =
    2 *
    Math.atan2(
      Math.sqrt(safeA),
      Math.sqrt(1 - safeA)
    );

  return EARTH_RADIUS_KM * c;
}

export function findNearestHospital(
  hospitals,
  userLocation
) {
  if (!userLocation) {
    return null;
  }

  const validHospitals = hospitals.filter(
    (hospital) =>
      Number.isFinite(hospital.latitude) &&
      Number.isFinite(hospital.longitude)
  );

  if (validHospitals.length === 0) {
    return null;
  }

  const hospitalsWithDistance = validHospitals.map(
    (hospital) => ({
      ...hospital,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hospital.latitude,
        hospital.longitude
      ),
    })
  );

  return hospitalsWithDistance.reduce(
    (nearest, current) =>
      current.distance < nearest.distance
        ? current
        : nearest
  );
}
