"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Star, Clock } from "lucide-react"

type Store = {
  id: string
  name: string
  location: string | null
  rating: number
  deliveryTime: string
  minOrder: number
  emoji: string
}

export default function ClientHome() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = stores.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>Restaurants à Dakar</h1>
        <p style={{ color: "var(--ne-text-secondary)", fontSize: "14px" }}>
          Choisissez un restaurant et composez votre commande.
        </p>
      </div>

      <input
        className="ne-input"
        placeholder="Rechercher un restaurant..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ maxWidth: "360px", marginBottom: "24px" }}
      />

      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ne-skeleton" style={{ height: "140px" }} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p style={{ color: "var(--ne-text-muted)", textAlign: "center", padding: "48px 0" }}>
          Aucun restaurant trouvé.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/client/store/${s.id}`}
              className="ne-card ne-quicklink-card"
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ fontSize: "36px" }}>{s.emoji}</div>
              <h3 style={{ fontSize: "16px" }}>{s.name}</h3>
              {s.location && (
                <p style={{ color: "var(--ne-text-muted)", fontSize: "12.5px" }}>{s.location}</p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "12.5px", color: "var(--ne-text-secondary)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={13} style={{ color: "var(--ne-accent)" }} fill="var(--ne-accent)" /> {s.rating.toFixed(1)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={13} /> {s.deliveryTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
