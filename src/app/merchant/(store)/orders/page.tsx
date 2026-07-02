"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, RefreshCw, Eye, CheckCircle, XCircle, Truck, Clock, ChefHat, Loader2 } from "lucide-react"

const allOrders = [
  { id: "#1042", customer: "Amadou Diallo", phone: "+221 77 123 4567", items: [{ name: "Riz au poisson", qty: 1, price: 3500 }, { name: "Thiébou dieun", qty: 2, price: 2500 }], total: 8500, status: "En livraison", time: "14:32", address: "Marché Sandaga, Dakar", driver: "Ibou Faye" },
  { id: "#1041", customer: "Fatou Sarr", phone: "+221 76 234 5678", items: [{ name: "Yassa poulet", qty: 1, price: 3500 }], total: 3500, status: "En préparation", time: "14:18", address: "Plateau, Dakar", driver: null },
  { id: "#1040", customer: "Moussa Ba", phone: "+221 78 345 6789", items: [{ name: "Mafé bœuf", qty: 2, price: 3000 }, { name: "Jus bissap", qty: 3, price: 2000 }], total: 12000, status: "Livré", time: "13:55", address: "Rufisque Centre", driver: "Cheikh Diop" },
  { id: "#1039", customer: "Aïssatou Fall", phone: "+221 77 456 7890", items: [{ name: "Thiébou yapp", qty: 1, price: 6500 }], total: 6500, status: "Livré", time: "13:20", address: "HLM, Dakar", driver: "Moustapha Sow" },
  { id: "#1038", customer: "Omar Ndiaye", phone: "+221 76 567 8901", items: [{ name: "Riz sauté", qty: 2, price: 2500 }, { name: "Jus gingembre", qty: 2, price: 2100 }], total: 9200, status: "Annulé", time: "12:45", address: "Keur Massar", driver: null },
  { id: "#1037", customer: "Mariama Diallo", phone: "+221 70 678 9012", items: [{ name: "Domoda", qty: 1, price: 4000 }], total: 4000, status: "En attente", time: "15:01", address: "Grand Yoff, Dakar", driver: null },
  { id: "#1036", customer: "Souleymane Ba", phone: "+221 77 789 0123", items: [{ name: "Riz au poisson", qty: 2, price: 3500 }], total: 7000, status: "En attente", time: "15:05", address: "Pikine Nord", driver: null },
]

const tabs = ["Tout", "En attente", "En préparation", "En livraison", "Livré", "Annulé"]

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  "En attente": { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  "En préparation": { color: "bg-blue-100 text-blue-700", icon: ChefHat },
  "En livraison": { color: "bg-cyan-100 text-cyan-700", icon: Truck },
  "Livré": { color: "bg-green-100 text-green-700", icon: CheckCircle },
  "Annulé": { color: "bg-red-100 text-red-700", icon: XCircle },
}

function OrdersContent() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("store") ?? "1"
  const [activeTab, setActiveTab] = useState("Tout")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = allOrders.filter(o =>
    (activeTab === "Tout" || o.status === activeTab) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  )

  const selectedOrder = allOrders.find(o => o.id === selected)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Commandes</h1>
        <p className="text-sm text-gray-500">Gérez vos commandes en temps réel</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-cyan-500 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
            {tab !== "Tout" && (
              <span className="ml-1.5 opacity-70">{allOrders.filter(o => o.status === tab).length}</span>
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
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher commande..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
        <button onClick={() => setSearch("")} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <RefreshCw size={16} />
        </button>
        <button onClick={() => {
          const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
          audio.play().catch(console.error)
          alert("🔔 Alarme déclenchée : Une nouvelle commande (ou notification de livraison globale) requiert votre attention immédiate.")
        }} className="flex items-center gap-2 px-3 py-2 border border-blue-200 bg-blue-50 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors shadow-sm cursor-pointer" title="Tester la notification sonore de commande">
          🔔 Alarme de notification
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Orders list */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map(order => {
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
                      {order.id.slice(1)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{order.customer}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{order.items.map(i => `${i.name} x${i.qty}`).join(", ")}</div>
                      <div className="text-xs text-gray-400">{order.address}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-800 text-sm">{order.total.toLocaleString("fr-FR")} FCFA</div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${cfg.color}`}>
                      <StatusIcon size={11} />
                      {order.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-0.5">{order.time}</div>
                  </div>
                </div>

                {/* Quick actions for pending */}
                {order.status === "En attente" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                    <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                      <CheckCircle size={14} /> Accepter
                    </button>
                    <button className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                      <XCircle size={14} /> Refuser
                    </button>
                  </div>
                )}
                {order.status === "En préparation" && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <button className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                      <Truck size={14} /> Marquer comme prête
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune commande trouvée</p>
            </div>
          )}
        </div>

        {/* Order detail */}
        <div>
          {selectedOrder ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-0">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Détail {selectedOrder.id}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">CLIENT</div>
                  <div className="font-medium text-gray-800">{selectedOrder.customer}</div>
                  <div className="text-sm text-gray-500">{selectedOrder.phone}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">ADRESSE</div>
                  <div className="text-sm text-gray-700">{selectedOrder.address}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">ARTICLES</div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                        <span className="font-medium">{(item.price * item.qty).toLocaleString("fr-FR")} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 mt-3 pt-3">
                    <span>Total</span>
                    <span>{selectedOrder.total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
                {selectedOrder.driver ? (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">LIVREUR</div>
                    <div className="flex items-center gap-2 p-2 bg-cyan-50 rounded-xl">
                      <div className="w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {selectedOrder.driver.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{selectedOrder.driver}</span>
                    </div>
                  </div>
                ) : selectedOrder.status === "En préparation" || selectedOrder.status === "En attente" ? (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 mb-2">ASSIGNATION LIVREUR</div>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 text-gray-700 bg-white">
                      <option value="auto">🤖 Assignation automatique (Le plus proche)</option>
                      <option value="manual_1">🛵 Cheikh Diop (À 200m - Actif)</option>
                      <option value="manual_2">🛵 Ibrahima Sarr (À 500m - Actif)</option>
                      <option value="manual_3">🛵 Babacar Ndiaye (À 1.2km - Actif)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">Laissez sur Automatique pour l'assigner au livreur le plus proche sur le même itinéraire.</p>
                    <button onClick={() => alert("Livreur assigné avec succès. Le livreur recevra une notification.")} className="w-full mt-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-semibold transition-colors">
                      Valider l'assignation
                    </button>
                  </div>
                ) : null}
                <button className="w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Eye size={15} /> Voir détails complets
                </button>
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

function ShoppingBag({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
}

export default function MerchantOrdersPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 size={28} className="text-cyan-500 animate-spin" /></div>}>
      <OrdersContent />
    </Suspense>
  )
}
