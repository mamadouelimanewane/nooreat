/**
 * LocationIQ — Geocoding, Directions & Static Maps
 * Docs : https://locationiq.com/docs
 */

export const LOCATIONIQ_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY ?? ""

/** URL des tuiles de carte LocationIQ (style streets) */
export function getTileUrl(style: "streets" | "satellite" | "hybrid" = "streets") {
  const styleMap = {
    streets: "streets",
    satellite: "satellite",
    hybrid: "hybrid",
  }
  return `https://{s}-tiles.locationiq.com/v3/${styleMap[style]}/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`
}

/** Attribution obligatoire LocationIQ */
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://locationiq.com">LocationIQ</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

export interface GeocodingResult {
  lat: string
  lon: string
  display_name: string
  address: {
    road?: string
    suburb?: string
    city?: string
    country?: string
  }
}

/** Géocodage direct (adresse → coordonnées) */
export async function geocode(query: string): Promise<GeocodingResult[]> {
  const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Geocoding failed")
  return res.json()
}

/** Géocodage inverse (coordonnées → adresse) */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Reverse geocoding failed")
  return res.json()
}

export interface DirectionsLeg {
  distance: number
  duration: number
  steps: {
    distance: number
    duration: number
    name: string
    maneuver: { type: string; modifier?: string }
  }[]
}

export interface DirectionsResult {
  code: string
  routes: {
    distance: number
    duration: number
    geometry: { coordinates: [number, number][] }
    legs: DirectionsLeg[]
  }[]
}

/** Itinéraire entre deux points via l'API Directions LocationIQ */
export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: "driving" | "cycling" | "walking" = "driving"
): Promise<DirectionsResult> {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`
  const url = `https://us1.locationiq.com/v1/directions/${mode}/${coords}?key=${LOCATIONIQ_KEY}&steps=true&geometries=geojson&overview=full`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? "Directions API error")
  }
  return res.json()
}

/** Autocomplete / Recherche de lieu */
export async function autocomplete(query: string, lat?: number, lon?: number) {
  const proximity = lat && lon ? `&proximity=${lon},${lat}` : ""
  const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&limit=5&dedupe=1${proximity}&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Autocomplete failed")
  return res.json()
}

/** URL d'une carte statique (image PNG) */
export function staticMapUrl({
  lat,
  lng,
  zoom = 14,
  width = 600,
  height = 300,
  markers,
}: {
  lat: number
  lng: number
  zoom?: number
  width?: number
  height?: number
  markers?: { lat: number; lng: number; color?: string }[]
}) {
  let url = `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_KEY}`
  url += `&center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}`
  if (markers) {
    const markerStr = markers
      .map(m => `${m.lat},${m.lng},${m.color ?? "red"}`)
      .join("|")
    url += `&markers=${markerStr}`
  }
  return url
}
