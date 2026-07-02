// ═══════════════════════════════════════════════════════
// Configuration Cartographie
// Google Maps → tuiles visuelles (render natif, tarif gratuit)
// LocationIQ  → API de directions/routage (évite $ Google Directions)
// ═══════════════════════════════════════════════════════

// Clé Google Maps (SDK Android/iOS — uniquement pour les tuiles)
export const GOOGLE_MAPS_KEY = "AIzaSyAK3BjGZQy70ogTMi1yr8W8Yw4YeeZ2PK8"

// Clé LocationIQ (directions + géocodage uniquement)
export const LOCATIONIQ_KEY = "pk.ef8f3d80db02a286ae4b6fae736af632"

// API Directions LocationIQ (OSRM-based, pas Google Directions)
// Format : lat/lng ORIGINE → DESTINATION
export const LOCATIONIQ_DIRECTIONS_URL = (originLat: number, originLng: number, destLat: number, destLng: number) =>
  `https://us1.locationiq.com/v1/directions/driving/${originLng},${originLat};${destLng},${destLat}?key=${LOCATIONIQ_KEY}&steps=false&geometries=polyline&overview=full`

// API Géocodage inverse LocationIQ (coordonnées → adresse)
export const LOCATIONIQ_REVERSE_URL = (lat: number, lon: number) =>
  `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`

// Décodage de Polyline encodée (format Google/OSRM)
export function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  const coords: { latitude: number; longitude: number }[] = []
  let index = 0, lat = 0, lng = 0
  while (index < encoded.length) {
    let shift = 0, result = 0, b: number
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = 0; result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 })
  }
  return coords
}
