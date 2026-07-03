"use client"

import { useEffect, useState } from "react"
import { Search, RefreshCw, Eye, CheckCircle, XCircle, Truck, Clock, ChefHat, Loader2 } from "lucide-react"

type OrderItem = { productId: string; quantity: number; price: number; name: string }
type Order = {
  id: string
  orderId: string
  total: number
  status: string
  address: string | null
  createdAt: string
  customerName: string
  customerPhone: string | null
  items: OrderItem[]
}

const STATUS_LABELS: Record<string, string> = {
  Pending: "En attente",
  Processing: "En préparation",
  Completed: "Livré",
  Cancelled: "Annulé",
}

const tabs = ["Tout", "Pending", "Processing", "Completed", "Cancelled"]

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  Processing: { color: "bg-blue-100 text-blue-700", icon: ChefHat },
  Completed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  Cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Tout")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await fetch("/api/merchant/orders")
      const data = await res.json()
      setOrders(res.ok ? data.orders : [])
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/merchant/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const { order } = await res.json()
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: order.status } : o)))
      }
    } finally {
      setUpdating(null)
    }
  }

  const filtered = orders.filter(
    (o) =>
      (activeTab === "Tout" || o.status === activeTab) &&
      (o.customerName.toLowerCase().includes(search.toLowerCase()) || o.orderId.includes(search))
  )

  const selectedOrder = orders.find((o) => o.id === selected)

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 size={28} className="text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Commandes</h1>
        <p className="text-sm text-gray-500">Gérez vos commandes en temps réel</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-cyan-500 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab === "Tout" ? "Tout" : STATUS_LABELS[tab]}
            {tab !== "Tout" && (
              <span className="ml-1.5 opacity-70">{orders.filter((o) => o.status === tab).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher commande..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
        <button onClick={loadOrders} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Orders list */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status] ?? { color: "bg-gray-100 text-gray-600", icon: Clock }
            const StatusIcon = cfg.icon
            return (
              <div
                key={order.id}
                onClick={() => setSelected(order.id === selected ? null : order.id)}
                className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${
                  selected === order.id ? "border-cyan-300 shadow-md shadow-cyan-100" : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      #{order.orderId.slice(-4)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{order.customerName}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</div>
                      <div className="text-xs text-gray-400">{order.address}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-800 text-sm">{order.total.toLocaleString("fr-FR")} FCFA</div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${cfg.color}`}>
                      <StatusIcon size={11} />
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                {order.status === "Pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order.id, "Processing")}
                      className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14} /> Accepter
                    </button>
                    <button
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order.id, "Cancelled")}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={14} /> Refuser
                    </button>
                  </div>
                )}
                {order.status === "Processing" && (
                  <div className="mt-3 pt-3 border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order.id, "Completed")}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Truck size={14} /> Marquer comme livrée
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune commande trouvée</p>
            </div>
          )}
        </div>

        {/* Order detail */}
        <div>
          {selectedOrder ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-0">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Détail #{selectedOrder.orderId.slice(-4)}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">CLIENT</div>
                  <div className="font-medium text-gray-800">{selectedOrder.customerName}</div>
                  {selectedOrder.customerPhone && <div className="text-sm text-gray-500">{selectedOrder.customerPhone}</div>}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">ADRESSE</div>
                  <div className="text-sm text-gray-700">{selectedOrder.address ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">ARTICLES</div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString("fr-FR")} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 mt-3 pt-3">
                    <span>Total</span>
                    <span>{selectedOrder.total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
              <Eye size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Cliquez sur une commande pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
