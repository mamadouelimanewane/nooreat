"use client"

import { useEffect, useRef } from "react"
import { getTileUrl, TILE_ATTRIBUTION, LOCATIONIQ_KEY } from "@/lib/locationiq"

export interface MapMarker {
  id: string | number
  lat: number
  lng: number
  color: "green" | "orange" | "red" | "blue" | "gray" | "purple"
  title: string
  popup?: string
}

export interface MapRoute {
  coordinates: [number, number][]
  color?: string
}

interface LeafletMapProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  routes?: MapRoute[]
  style?: "streets" | "satellite" | "hybrid"
  className?: string
  onMarkerClick?: (id: string | number) => void
}

const COLOR_MAP: Record<string, string> = {
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  blue: "#3b82f6",
  gray: "#9ca3af",
  purple: "#a855f7",
}

export default function LeafletMap({
  center = [14.6928, -17.4467],
  zoom = 12,
  markers = [],
  routes = [],
  style = "streets",
  className = "h-96",
  onMarkerClick,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!LOCATIONIQ_KEY) return

    let L: typeof import("leaflet")

    async function init() {
      L = (await import("leaflet")).default

      // Fix icônes Leaflet avec Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current!, { center, zoom })
      mapRef.current = map

      // Tuiles LocationIQ
      L.tileLayer(getTileUrl(style), {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
        subdomains: ["eu1", "eu2"],
      }).addTo(map)

      // Marqueurs
      markers.forEach(m => {
        const color = COLOR_MAP[m.color] ?? COLOR_MAP.blue
        const icon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })
        const marker = L.marker([m.lat, m.lng], { icon, title: m.title })
        if (m.popup) marker.bindPopup(m.popup)
        if (onMarkerClick) marker.on("click", () => onMarkerClick(m.id))
        marker.addTo(map)
      })

      // Routes / itinéraires
      routes.forEach(route => {
        if (route.coordinates.length < 2) return
        // coordinates sont [lng, lat] depuis GeoJSON → inverser pour Leaflet [lat, lng]
        const latlngs = route.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
        L.polyline(latlngs, {
          color: route.color ?? "#3b82f6",
          weight: 4,
          opacity: 0.8,
        }).addTo(map)
      })
    }

    init().catch(console.error)

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapRef.current as any).remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!LOCATIONIQ_KEY) {
    return (
      <div className={`${className} bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 border border-dashed border-gray-300`}>
        <span className="text-3xl">🗺️</span>
        <p className="text-sm text-gray-500 font-medium">Clé API LocationIQ manquante</p>
        <p className="text-xs text-gray-400">
          Ajoutez <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_LOCATIONIQ_KEY</code> dans <code className="bg-gray-200 px-1 rounded">.env.local</code>
        </p>
        <a
          href="https://locationiq.com/register"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
        >
          Obtenir une clé gratuite
        </a>
      </div>
    )
  }

  return (
    <>
      {/* CSS Leaflet */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={containerRef} className={`${className} rounded-xl overflow-hidden z-0`} />
    </>
  )
}
