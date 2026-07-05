"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Car, Star, KeyRound } from "lucide-react"
import { getClientSession, clientFetch } from "@/lib/clientSession"

type OrderDetail = {
  id: string
  orderId: string
  total: number
  status: string
  address: string | null
  deliveryPin: string | null
  createdAt: string
  storeName: string
  items: { productId: string; name: string; quantity: number; price: number }[]
  driver: { name: string; phone: string | null; vehicle: string | null; rating: number } | null
}

const STEPS = [
  { key: "Pending", label: "Confirmée" },
  { key: "Processing", label: "En préparation / en livraison" },
  { key: "Completed", label: "Livrée" },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!getClientSession()) {
      router.push(`/client/login?from=/client/orders/${id}`)
      return
    }
    clientFetch(`/api/orders/${id}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Commande introuvable")
          return
        }
        setOrder(data)
      })
  }, [id, router])

  if (error) return <div className="text-center py-16 text-neutral-500">{error}</div>
  if (!order) return <div className="max-w-lg mx-auto px-4 py-6"><div className="h-52 rounded-2xl bg-neutral-100 animate-pulse" /></div>

  const stepIndex = order.status === "Cancelled" ? -1 : STEPS.findIndex((s) => s.key === order.status)

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-lg font-extrabold mb-0.5">{order.storeName}</h1>
      <p className="text-neutral-400 text-xs mb-5">
        #{order.orderId} · {new Date(order.createdAt).toLocaleString("fr-FR")}
      </p>

      {order.status === "Cancelled" ? (
        <div className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">Commande annulée</div>
      ) : (
        <div className="border border-neutral-200 rounded-2xl p-5 mb-5">
          <div className="flex justify-between">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex-1 text-center" style={{ opacity: i <= stepIndex ? 1 : 0.35 }}>
                <div className={`w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-[11px] font-bold ${i <= stepIndex ? "bg-[#06C167] text-black" : "bg-neutral-100 text-neutral-400"}`}>
                  {i + 1}
                </div>
                <div className="text-[11px] text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.deliveryPin && order.status !== "Completed" && order.status !== "Cancelled" && (
        <div className="border border-[#06C167]/30 bg-[#06C167]/5 rounded-2xl p-4 mb-4 flex items-center gap-2.5">
          <KeyRound size={18} className="text-[#06C167]" />
          <span className="text-sm">Code de remise au livreur : <strong>{order.deliveryPin}</strong></span>
        </div>
      )}

      {order.driver && (
        <div className="border border-neutral-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">
            {order.driver.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{order.driver.name}</div>
            <div className="flex gap-3 text-xs text-neutral-500">
              {order.driver.vehicle && <span className="flex items-center gap-1"><Car size={12} />{order.driver.vehicle}</span>}
              <span className="flex items-center gap-1"><Star size={12} />{order.driver.rating.toFixed(1)}</span>
            </div>
          </div>
          {order.driver.phone && (
            <a href={`tel:${order.driver.phone}`} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition"><Phone size={16} /></a>
          )}
        </div>
      )}

      <div className="border border-neutral-200 rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-3">Articles</h2>
        <div className="space-y-2">
          {order.items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.quantity}× {i.name}</span>
              <span className="font-medium">{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-neutral-100">
          <span>Total</span>
          <span>{order.total.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      {order.address && (
        <p className="text-neutral-400 text-xs">Livraison : {order.address}</p>
      )}
    </div>
  )
}
