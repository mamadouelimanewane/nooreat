"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getClientSession, clientFetch } from "@/lib/clientSession"

type Order = {
  id: string
  orderId: string
  total: number
  status: string
  createdAt: string
  store: { name: string; image: string | null }
}

const STATUS_BADGE: Record<string, string> = {
  Pending: "ne-badge-warning",
  Processing: "ne-badge-info",
  Completed: "ne-badge-success",
  Cancelled: "ne-badge-danger",
}
const STATUS_LABEL: Record<string, string> = {
  Pending: "En attente",
  Processing: "En cours",
  Completed: "Livrée",
  Cancelled: "Annulée",
}

export default function ClientOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    if (!getClientSession()) {
      router.push("/client/login?from=/client/orders")
      return
    }
    clientFetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
  }, [router])

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>Mes commandes</h1>

      {orders === null && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[...Array(3)].map((_, i) => <div key={i} className="ne-skeleton" style={{ height: "70px" }} />)}
        </div>
      )}

      {orders?.length === 0 && (
        <p style={{ color: "var(--ne-text-muted)", textAlign: "center", padding: "48px 0" }}>
          Vous n&apos;avez pas encore passé de commande.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {orders?.map((o) => (
          <Link key={o.id} href={`/client/orders/${o.id}`} className="ne-card" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14.5px" }}>{o.store.name}</div>
              <div style={{ color: "var(--ne-text-muted)", fontSize: "12px" }}>
                #{o.orderId} · {new Date(o.createdAt).toLocaleString("fr-FR")}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "var(--ne-accent)", marginBottom: "4px" }}>{o.total.toLocaleString("fr-FR")} FCFA</div>
              <span className={`ne-badge ${STATUS_BADGE[o.status] ?? "ne-badge-muted"}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
