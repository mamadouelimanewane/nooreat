"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Star, Clock, Search } from "lucide-react"

type Store = {
  id: string
  name: string
  location: string | null
  rating: number
  deliveryTime: string
  minOrder: number
  emoji: string
  photo: string | null
  cuisine: string
  description: string | null
  deliveryFee: number
}

const CARD_COLORS = [
  "bg-orange-50", "bg-emerald-50", "bg-rose-50", "bg-amber-50",
  "bg-sky-50", "bg-violet-50", "bg-lime-50", "bg-pink-50",
]

export default function ClientHome() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [activeCuisine, setActiveCuisine] = useState("Tout")

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const cuisines = useMemo(() => {
    const set = new Set(stores.map((s) => s.cuisine).filter(Boolean))
    return ["Tout", ...Array.from(set).sort()]
  }, [stores])

  const filtered = stores.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase())
    const matchesCuisine = activeCuisine === "Tout" || s.cuisine === activeCuisine
    return matchesQuery && matchesCuisine
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un restaurant, un plat..."
          className="w-full bg-neutral-100 rounded-full py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-black/10 placeholder:text-neutral-500"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCuisine(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
              activeCuisine === c
                ? "bg-black text-white border-black"
                : "bg-[#fff] text-neutral-700 border-neutral-200 hover:border-neutral-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <h1 className="text-xl font-extrabold mb-4">
        {activeCuisine === "Tout" ? "Tous les restaurants" : activeCuisine}
      </h1>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse h-56" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-neutral-400 text-center py-16">Aucun restaurant trouvé.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7">
          {filtered.map((s, i) => (
            <Link key={s.id} href={`/client/store/${s.id}`} className="group">
              <div className={`relative aspect-[4/3] rounded-2xl ${CARD_COLORS[i % CARD_COLORS.length]} flex items-center justify-center overflow-hidden mb-2.5`}>
                {s.photo ? (
                  <img
                    src={s.photo}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-200">{s.emoji}</span>
                )}
                <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#fff]/95 backdrop-blur flex items-center justify-center text-sm">
                  {s.emoji}
                </span>
                <span className="absolute bottom-2 left-2 bg-[#fff]/95 backdrop-blur px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                  <Star size={11} className="fill-black" /> {s.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="font-bold text-[15px] leading-snug truncate">{s.name}</h3>
              <p className="text-neutral-500 text-[13px] truncate">{s.cuisine}</p>
              <div className="flex items-center gap-1.5 text-[13px] text-neutral-500 mt-0.5">
                <Clock size={13} />
                <span>{s.deliveryTime}</span>
                <span>·</span>
                <span>{s.deliveryFee === 0 ? "Livraison gratuite" : `${s.deliveryFee.toLocaleString("fr-FR")} FCFA`}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
