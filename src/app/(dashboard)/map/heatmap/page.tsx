"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Loader2, Flame, Calendar, RefreshCw } from "lucide-react"
import { getTileUrl, TILE_ATTRIBUTION, LOCATIONIQ_KEY } from "@/lib/locationiq"

// Points de chaleur : zones de forte densité de commandes à Dakar
const HEAT_POINTS: [number, number, number][] = [
  // [lat, lng, intensité 0-1]
  [14.6928, -17.4467, 1.0],   // Dakar Centre
  [14.6875, -17.4393, 0.9],   // Plateau
  [14.6821, -17.4502, 0.85],  // Médina
  [14.6950, -17.4380, 0.8],   // HLM
  [14.7123, -17.4456, 0.75],  // Grand Yoff
  [14.7321, -17.4128, 0.7],   // Parcelles
  [14.7712, -17.3987, 0.65],  // Guédiawaye
  [14.6750, -17.4600, 0.6],   // Fann-Point E
  [14.7050, -17.4700, 0.55],  // Almadies
  [14.7200, -17.4850, 0.5],   // Ngor
  [14.6600, -17.4250, 0.45],  // Île de Gorée (zone)
  [14.7400, -17.4300, 0.4],   // Patte d'Oie
  [14.7600, -17.4100, 0.35],  // Pikine
  [14.7800, -17.4500, 0.3],   // Yeumbeul
]

function HeatMapLeaflet({ period }: { period: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !LOCATIONIQ_KEY) return

    async function init() {
      const L = (await import("leaflet")).default

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current!, { center: [14.7050, -17.4350], zoom: 12 })
      mapRef.current = map

      L.tileLayer(getTileUrl("streets"), {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
        subdomains: ["eu1", "eu2"],
      }).addTo(map)

      // Simuler la heat map avec des cercles colorés (dégradé rouge-orange-jaune)
      const multiplier = period === "today" ? 1 : period === "week" ? 0.8 : 0.6
      HEAT_POINTS.forEach(([lat, lng, intensity]) => {
        const adjustedIntensity = intensity * multiplier
        const radius = 300 + adjustedIntensity * 700 // 300m à 1km

        // Cercle extérieur (jaune transparent)
        L.circle([lat, lng], {
          radius: radius * 1.5,
          color: "transparent",
          fillColor: "#fbbf24",
          fillOpacity: adjustedIntensity * 0.15,
        }).addTo(map)

        // Cercle moyen (orange)
        L.circle([lat, lng], {
          radius: radius,
          color: "transparent",
          fillColor: adjustedIntensity > 0.7 ? "#ef4444" : adjustedIntensity > 0.4 ? "#f97316" : "#fbbf24",
          fillOpacity: adjustedIntensity * 0.3,
        }).addTo(map)

        // Point central
        L.circle([lat, lng], {
          radius: radius * 0.3,
          color: "transparent",
          fillColor: adjustedIntensity > 0.7 ? "#dc2626" : adjustedIntensity > 0.4 ? "#ea580c" : "#d97706",
          fillOpacity: adjustedIntensity * 0.6,
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
  }, [period])

  return <div ref={containerRef} className="h-[480px] rounded-xl overflow-hidden z-0" />
}

const DynamicHeatMap = dynamic(
  () => Promise.resolve(HeatMapLeaflet),
  { ssr: false, loading: () => <div className="h-[480px] bg-gray-100 rounded-xl flex items-center justify-center"><Loader2 size={24} className="animate-spin text-orange-500" /></div> }
)

export default function HeatMapPage() {
  const [period, setPeriod] = useState("today")
  const [key, setKey] = useState(0)

  const refresh = () => setKey(k => k + 1)

  const zoneStats = [
    { zone: "Dakar Centre", orders: 1240, trend: "+12%" },
    { zone: "Plateau", orders: 987, trend: "+8%" },
    { zone: "Grand Yoff", orders: 754, trend: "+5%" },
    { zone: "Parcelles", orders: 621, trend: "+18%" },
    { zone: "Guédiawaye", orders: 489, trend: "-3%" },
    { zone: "Médina", orders: 412, trend: "+2%" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Flame size={18} className="text-orange-500" /> Heat Map — Densité des commandes
        </h1>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          {[
            { value: "today", label: "Aujourd'hui" },
            { value: "week", label: "Cette semaine" },
            { value: "month", label: "Ce mois" },
          ].map(p => (
            <button key={p.value} onClick={() => { setPeriod(p.value); setKey(k => k + 1) }}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors ${period === p.value ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
              {p.label}
            </button>
          ))}
          <button onClick={refresh} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
          <DynamicHeatMap key={key} period={period} />
          {/* Légende */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 flex-wrap">
            <span className="font-medium text-gray-600">Densité :</span>
            {[
              { color: "bg-yellow-300", label: "Faible" },
              { color: "bg-orange-400", label: "Modérée" },
              { color: "bg-orange-600", label: "Élevée" },
              { color: "bg-red-500", label: "Très élevée" },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1">
                <span className={`w-4 h-3 rounded ${l.color} inline-block opacity-80`} /> {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Top zones */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm pb-2 border-b border-gray-100">Top zones — {period === "today" ? "Aujourd'hui" : period === "week" ? "Semaine" : "Mois"}</h2>
          <div className="space-y-2">
            {zoneStats.map((z, i) => (
              <div key={z.zone} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-700 truncate">{z.zone}</span>
                    <span className={`text-xs font-semibold ${z.trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{z.trend}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-red-500" : i < 3 ? "bg-orange-400" : "bg-yellow-400"}`}
                      style={{ width: `${(z.orders / zoneStats[0].orders) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{z.orders.toLocaleString()} commandes</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-orange-600">4 503</p>
              <p className="text-xs text-orange-500">Total commandes</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-red-600">6</p>
              <p className="text-xs text-red-500">Zones actives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
