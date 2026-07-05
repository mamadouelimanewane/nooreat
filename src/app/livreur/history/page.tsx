"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"
import { getDriverSession, driverFetch } from "@/lib/driverSession"

type DriverOrder = {
  id: string
  orderId: string
  status: string
  storeAddress: string
  deliveryAddress: string
  customerName: string
  total: number
  items: number
  earnings: number
  createdAt: string
}

const STATUS_LABEL: Record<string, string> = { Completed: "Livrée", Cancelled: "Annulée" }
const STATUS_BADGE: Record<string, string> = { Completed: "ne-badge-success", Cancelled: "ne-badge-danger" }

export default function LivreurHistoryPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<DriverOrder[] | null>(null)

  useEffect(() => {
    if (!getDriverSession()) {
      router.push("/livreur/login")
      return
    }
    driverFetch("/api/driver/orders/history").then((r) => r.json()).then((d) => setOrders(Array.isArray(d) ? d : []))
  }, [router])

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>Historique des livraisons</h1>

      {orders === null && <div className="ne-skeleton" style={{ height: "120px" }} />}
      {orders?.length === 0 && <p style={{ color: "var(--ne-text-muted)", padding: "24px 0" }}>Aucune livraison pour le moment.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {orders?.map((o) => (
          <div key={o.id} className="ne-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span className={`ne-badge ${STATUS_BADGE[o.status] ?? "ne-badge-muted"}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
              <span style={{ fontWeight: 700, color: "var(--ne-accent)" }}>+{o.earnings.toLocaleString("fr-FR")} FCFA</span>
            </div>
            <p style={{ fontSize: "13.5px", marginBottom: "4px" }}>{o.customerName} · {o.items} article(s) · {o.total.toLocaleString("fr-FR")} FCFA</p>
            <p style={{ fontSize: "12px", color: "var(--ne-text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPin size={11} /> {o.storeAddress} → {o.deliveryAddress} · {new Date(o.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
