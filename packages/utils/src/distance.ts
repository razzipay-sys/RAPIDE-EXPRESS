const EARTH_RADIUS_KM = 6371;

export interface Coords {
  latitude: number;
  longitude: number;
}

/** Haversine formula — returns distance in kilometers */
export function haversineDistance(a: Coords, b: Coords): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function metersToKm(meters: number): number {
  return meters / 1000;
}

export function kmToMeters(km: number): number {
  return km * 1000;
}

/** Estimate delivery time: base 5 min + 3 min per km (motorcycle in city) */
export function estimateDeliveryMinutes(distanceKm: number): number {
  return Math.round(5 + distanceKm * 3);
}

/** Bounds that contain all the given coordinates */
export function getBoundsFromCoords(coords: Coords[]): {
  sw: Coords;
  ne: Coords;
} {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  return {
    sw: { latitude: Math.min(...lats), longitude: Math.min(...lngs) },
    ne: { latitude: Math.max(...lats), longitude: Math.max(...lngs) },
  };
}
