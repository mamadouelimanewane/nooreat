"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { Search, RefreshCw, Navigation, Phone, Package, Route, MapPin, Loader2 } from "lucide-react"
import type { MapMarker, MapRoute } from "@/components/ui/LeafletMap"
import { getDirections, reverseGeocode } from "@/lib/locationiq"

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const LeafletMap = dynamic(() => import("@/components/ui/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-blue-500" />
    </div>
  ),
})

const mockDrivers = [
  { id: 1, name: "Mamadou Lamine Diallo", phone: "+221770000001", vehicle: "Moto", zone: "Dakar Centre", lat: 14.6982, lng: -17.4436, status: "online" as const, orders: 3, lastSeen: "À l'instant" },
  { id: 2, name: "Ibrahima Fall", phone: "+221778881234", vehicle: "Voiture", zone: "Plateau", lat: 14.6875, lng: -17.4393, status: "delivering" as const, orders: 1, lastSeen: "Il y a 1 min" },
  { id: 3, name: "Ousmane Diallo", phone: "+221769874321", vehicle: "Moto", zone: "Parcelles", lat: 14.7321, lng: -17.4128, status: "online" as const, orders: 0, lastSeen: "À l'instant" },
  { id: 4, name: "Cheikh Ndoye", phone: "+221775551234", vehicle: "Vélo", zone: "Médina", lat: 14.6821, lng: -17.4502, status: "offline" as const, orders: 0, lastSeen: "Il y a 18 min" },
  { id: 5, name: "Aliou Mbaye", phone: "+221771234567", vehicle: "Moto", zone: "Guédiawaye", lat: 14.7712, lng: -17.3987, status: "delivering" as const, orders: 2, lastSeen: "À l'instant" },
  { id: 6, name: "Samba Diagne", phone: "+221776549871", vehicle: "Moto", zone: "Grand Yoff", lat: 14.7123, lng: -17.4456, status: "online" as const, orders: 1, lastSeen: "Il y a 2 min" },
]

const STATUS = {
  online: { label: "En ligne", color: "green" as const, badge: "bg-green-100 text-green-700" },
  delivering: { label: "En livraison", color: "orange" as const, badge: "bg-orange-100 text-orange-700" },
  offline: { label: "Hors ligne", color: "gray" as const, badge: "bg-gray-100 text-gray-500" },
}

type DriverStatus = "online" | "delivering" | "offline"

export default function DriverMapPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<DriverStatus | "all">("all")
  const [selected, setSelected] = useState<number | null>(null)
  const [routes, setRoutes] = useState<MapRoute[]>([])
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets")

  const filtered = mockDrivers.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.zone.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || d.status === filter
    return matchSearch && matchFilter
  })

  const markers: MapMarker[] = filtered.map(d => ({
    id: d.id,
    lat: d.lat,
    lng: d.lng,
    color: STATUS[d.status].color,
    title: d.name,
    popup: `<strong>${d.name}</strong><br/>${d.vehicle} — ${d.zone}<br/><span style="color:${STATUS[d.status].color === "green" ? "#16a34a" : STATUS[d.status].color === "orange" ? "#ea580c" : "#6b7280"}">${STATUS[d.status].label}</span>`,
  }))

  const selectedDriver = mockDrivers.find(d => d.id === selected)

  // Adresse du livreur sélectionné via géocodage inverse
  useEffect(() => {
    if (!selectedDriver) { setAddress(null); return }
    setAddress(null)
    reverseGeocode(selectedDriver.lat, selectedDriver.lng)
      .then(r => setAddress(r.display_name?.split(",").slice(0, 3).join(", ") ?? null))
      .catch(() => setAddress(null))
  }, [selected, selectedDriver])

  // Afficher l'itinéraire depuis la base (Dakar HQ) vers le livreur sélectionné
  const showRoute = useCallback(async () => {
    if (!selectedDriver) return
    setLoadingRoute(true)
    setRoutes([])
    setRouteInfo(null)
    try {
      const result = await getDirections(
        { lat: 14.6928, lng: -17.4467 }, // QG Dakar
        { lat: selectedDriver.lat, lng: selectedDriver.lng }
      )
      const route = result.routes[0]
      if (route) {
        setRoutes([{ coordinates: route.geometry.coordinates, color: "#3b82f6" }])
        const km = (route.distance / 1000).toFixed(1)
        const min = Math.round(route.duration / 60)
        setRouteInfo({ distance: `${km} km`, duration: `${min} min` })
      }
    } catch {
      setRouteInfo(null)
    } finally {
      setLoadingRoute(false)
    }
  }, [selectedDriver])

  const stats = {
    online: mockDrivers.filter(d => d.status === "online").length,
    delivering: mockDrivers.filter(d => d.status === "delivering").length,
    offline: mockDrivers.filter(d => d.status === "offline").length,
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <MapPin size={18} className="text-blue-500" /> Carte des livreurs — temps réel
        </h1>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={() => setMapStyle("streets")}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-colors ${mapStyle === "streets" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
            Plan
          </button>
          <button onClick={() => setMapStyle("satellite")}
            className={`px-3 py-1.5 rounded-lg font-medium border transition-colors ${mapStyle === "satellite" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
            Satellite
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "online", label: "En ligne", val: stats.online, color: "text-green-600 bg-green-50 border-green-100" },
          { key: "delivering", label: "En livraison", val: stats.delivering, color: "text-orange-600 bg-orange-50 border-orange-100" },
          { key: "offline", label: "Hors ligne", val: stats.offline, color: "text-gray-500 bg-gray-50 border-gray-100" },
        ].map(s => (
          <div key={s.key} className={`rounded-xl border px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Carte */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
          <LeafletMap
            center={[14.6928, -17.4467]}
            zoom={12}
            markers={markers}
            routes={routes}
            style={mapStyle}
            className="h-[500px]"
            onMarkerClick={(id) => setSelected(Number(id))}
          />
          {/* Légende */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
            {Object.entries(STATUS).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${v.color === "green" ? "bg-green-500" : v.color === "orange" ? "bg-orange-400" : "bg-gray-400"}`} />
                {v.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 ml-2">
              <span className="w-6 h-1 bg-blue-500 rounded inline-block" /> Itinéraire
            </span>
          </div>
        </div>

        {/* Panneau livreurs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-3">
          {/* Filtres */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <button onClick={() => { setSearch(""); setFilter("all"); setRoutes([]); setSelected(null) }}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500">
              <RefreshCw size={13} />
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["all", "online", "delivering", "offline"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${filter === f ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f === "all" ? "Tous" : STATUS[f as DriverStatus].label}
              </button>
            ))}
          </div>

          {/* Liste */}
          <div className="overflow-y-auto max-h-80 space-y-1.5 flex-1">
            {filtered.map(d => (
              <button key={d.id} onClick={() => { setSelected(d.id === selected ? null : d.id); setRoutes([]); setRouteInfo(null) }}
                className={`w-full text-left p-2.5 rounded-lg border transition-colors ${selected === d.id ? "border-blue-400 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-800 truncate flex-1">{d.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ml-1 shrink-0 ${STATUS[d.status].badge}`}>
                    {STATUS[d.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{d.vehicle}</span>
                  <span>{d.zone}</span>
                  {d.orders > 0 && <span className="text-orange-500 font-medium flex items-center gap-0.5"><Package size={10} />{d.orders}</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Détail livreur sélectionné */}
          {selectedDriver && (
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <p className="text-xs font-semibold text-gray-700">{selectedDriver.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Phone size={11} />
                <a href={`tel:${selectedDriver.phone}`} className="hover:text-blue-500">{selectedDriver.phone}</a>
              </div>
              {address && (
                <div className="flex items-start gap-1.5 text-xs text-gray-400">
                  <MapPin size={11} className="mt-0.5 shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={showRoute} disabled={loadingRoute}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-xs rounded-lg font-medium">
                  {loadingRoute ? <Loader2 size={12} className="animate-spin" /> : <Route size={12} />}
                  Itinéraire
                </button>
                <a href={`https://waze.com/ul?ll=${selectedDriver.lat},${selectedDriver.lng}&navigate=yes`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-lg font-medium">
                  <Navigation size={12} /> Waze
                </a>
              </div>
              {routeInfo && (
                <div className="flex gap-2">
                  <span className="flex-1 bg-blue-50 text-blue-700 text-xs rounded-lg py-1.5 text-center font-semibold">{routeInfo.distance}</span>
                  <span className="flex-1 bg-green-50 text-green-700 text-xs rounded-lg py-1.5 text-center font-semibold">{routeInfo.duration}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
