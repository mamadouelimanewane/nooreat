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
  Pending: "bg-amber-50 text-amber-700",
  Processing: "bg-sky-50 text-sky-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
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
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-extrabold mb-5">Mes commandes</h1>

      {orders === null && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />)}
        </div>
      )}

      {orders?.length === 0 && (
        <p className="text-neutral-400 text-center py-16">Vous n&apos;avez pas encore passé de commande.</p>
      )}

      <div className="space-y-3">
        {orders?.map((o) => (
          <Link key={o.id} href={`/client/orders/${o.id}`} className="flex items-center justify-between border border-neutral-200 rounded-2xl p-4 hover:border-neutral-400 transition">
            <div>
              <div className="font-bold text-[15px]">{o.store.name}</div>
              <div className="text-neutral-400 text-xs mt-0.5">
                #{o.orderId} · {new Date(o.createdAt).toLocaleString("fr-FR")}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold mb-1">{o.total.toLocaleString("fr-FR")} FCFA</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[o.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                {STATUS_LABEL[o.status] ?? o.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
