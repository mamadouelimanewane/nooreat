"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Power, MapPin, Package, Star, Loader2, CheckCircle2 } from "lucide-react"
import { getDriverSession, driverFetch, setDriverSession, type DriverProfile } from "@/lib/driverSession"

type DriverOrder = {
  id: string
  orderId: string
  status: string
  storeAddress: string
  deliveryAddress: string
  customerName: string
  customerPhone: string
  total: number
  items: number
  earnings: number
  distance: string
  createdAt: string
}

export default function LivreurDashboard() {
  const router = useRouter()
  const [driver, setDriver] = useState<DriverProfile | null>(null)
  const [online, setOnline] = useState(false)
  const [available, setAvailable] = useState<DriverOrder[]>([])
  const [active, setActive] = useState<DriverOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    const res = await driverFetch("/api/driver/profile")
    if (!res.ok) return
    const data = await res.json()
    setDriver(data)
    setOnline(data.status === "Active")
    const session = getDriverSession()
    if (session) setDriverSession(session.token, data)
  }, [])

  const loadOrders = useCallback(async () => {
    const [av, ac] = await Promise.all([
      driverFetch("/api/driver/orders/available").then((r) => r.json()),
      driverFetch("/api/driver/orders/active").then((r) => r.json()),
    ])
    setAvailable(Array.isArray(av) ? av : [])
    setActive(Array.isArray(ac) ? ac : [])
  }, [])

  useEffect(() => {
    if (!getDriverSession()) {
      router.push("/livreur/login")
      return
    }
    Promise.all([loadProfile(), loadOrders()]).finally(() => setLoading(false))
  }, [router, loadProfile, loadOrders])

  async function toggleOnline() {
    const next = !online
    setOnline(next)
    await driverFetch("/api/driver/status", { method: "PUT", body: JSON.stringify({ online: next }) })
    if (next) loadOrders()
  }

  async function acceptOrder(id: string) {
    setBusyId(id)
    try {
      await driverFetch(`/api/driver/orders/${id}/accept`, { method: "POST" })
      await loadOrders()
    } finally {
      setBusyId(null)
    }
  }

  async function rejectOrder(id: string) {
    setBusyId(id)
    try {
      await driverFetch(`/api/driver/orders/${id}/reject`, { method: "POST" })
      await loadOrders()
    } finally {
      setBusyId(null)
    }
  }

  async function markDelivered(id: string) {
    setBusyId(id)
    try {
      await driverFetch(`/api/driver/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status: "DELIVERED" }) })
      await Promise.all([loadOrders(), loadProfile()])
    } finally {
      setBusyId(null)
    }
  }

  if (loading || !driver) {
    return <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}><Loader2 size={28} className="animate-spin" /></div>
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="ne-card" style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "20px" }}>{driver.name}</h1>
          <div style={{ display: "flex", gap: "14px", fontSize: "12.5px", color: "var(--ne-text-secondary)", marginTop: "4px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Star size={12} />{driver.rating.toFixed(1)}</span>
            <span>{driver.totalOrders} livraisons</span>
            <span>Solde : {driver.walletBalance.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>
        <button
          onClick={toggleOnline}
          className={online ? "ne-btn-primary" : "ne-btn-ghost"}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Power size={16} /> {online ? "En ligne" : "Hors ligne"}
        </button>
      </div>

      {active.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <div className="ne-section-header"><span className="ne-section-dot" /><span className="ne-section-title">Livraison en cours</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {active.map((o) => (
              <div key={o.id} className="ne-card ne-card-accent">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span className="ne-badge ne-badge-info">#{o.orderId}</span>
                  <span style={{ fontWeight: 700, color: "var(--ne-accent)" }}>+{o.earnings.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <p style={{ fontSize: "13.5px", marginBottom: "4px" }}><strong>{o.customerName}</strong> · {o.items} article(s) · {o.total.toLocaleString("fr-FR")} FCFA</p>
                <p style={{ fontSize: "12.5px", color: "var(--ne-text-secondary)", display: "flex", alignItems: "center", gap: "5px", marginBottom: "12px" }}>
                  <MapPin size={12} /> {o.storeAddress} → {o.deliveryAddress}
                </p>
                <button
                  onClick={() => markDelivered(o.id)}
                  disabled={busyId === o.id}
                  className="ne-btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {busyId === o.id ? <Loader2 size={15} className="animate-spin" /> : <><CheckCircle2 size={15} /> Marquer comme livrée</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ne-section-header"><span className="ne-section-dot" /><span className="ne-section-title">Commandes disponibles</span></div>
      {!online && <p style={{ color: "var(--ne-text-muted)", fontSize: "13px", padding: "16px 0" }}>Passez en ligne pour voir les commandes disponibles.</p>}
      {online && available.length === 0 && <p style={{ color: "var(--ne-text-muted)", fontSize: "13px", padding: "16px 0" }}>Aucune commande disponible pour le moment.</p>}
      {online && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {available.map((o) => (
            <div key={o.id} className="ne-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="ne-badge ne-badge-muted">#{o.orderId}</span>
                <span style={{ fontWeight: 700, color: "var(--ne-accent)" }}>+{o.earnings.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <p style={{ fontSize: "13.5px", marginBottom: "4px" }}>
                <Package size={13} style={{ marginRight: "4px", verticalAlign: "-2px" }} />
                {o.items} article(s) · {o.total.toLocaleString("fr-FR")} FCFA
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--ne-text-secondary)", display: "flex", alignItems: "center", gap: "5px", marginBottom: "12px" }}>
                <MapPin size={12} /> {o.storeAddress} → {o.deliveryAddress}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => acceptOrder(o.id)} disabled={busyId === o.id} className="ne-btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  {busyId === o.id ? <Loader2 size={15} className="animate-spin" /> : "Accepter"}
                </button>
                <button onClick={() => rejectOrder(o.id)} disabled={busyId === o.id} className="ne-btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                  Ignorer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
