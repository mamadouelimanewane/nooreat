"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Download, Search, RefreshCw } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const monthlyData = [
  { month: "Sep", earning: 28000 },
  { month: "Oct", earning: 42000 },
  { month: "Nov", earning: 38000 },
  { month: "Déc", earning: 65000 },
  { month: "Jan", earning: 51000 },
  { month: "Fév", earning: 72000 },
  { month: "Mar", earning: 87000 },
]

const earningsData = [
  { id: 3253, orderId: "#3253", store: "Marché Keur Massar", user: "Fatou Diallo", driver: "Bassirou Diao", product: "Tomate, Oignon, Riz", items: 3, subtotal: 12000, deliveryFee: 500, total: 12500, payment: "Cash", paymentStatus: "Payé", orderEarning: 1250, storeEarning: 11250, commissionPct: 10, area: "Dakar", status: "Completed", date: "2026-03-15 10:30:00" },
  { id: 3252, orderId: "#3252", store: "Marché Rufisque", user: "Oumar Ba", driver: "—", product: "Poulet, Légumes", items: 2, subtotal: 8250, deliveryFee: 500, total: 8750, payment: "Orange Money", paymentStatus: "En attente", orderEarning: 875, storeEarning: 7875, commissionPct: 10, area: "Dakar", status: "Processing", date: "2026-03-15 09:45:00" },
  { id: 3251, orderId: "#3251", store: "France Mangasin test", user: "Aissatou Ndiaye", driver: "—", product: "Pain, Beurre", items: 1, subtotal: 4700, deliveryFee: 500, total: 5200, payment: "Wave", paymentStatus: "Payé", orderEarning: 520, storeEarning: 4680, commissionPct: 10, area: "Dakar", status: "Completed", date: "2026-03-15 09:00:00" },
  { id: 3250, orderId: "#3250", store: "Marché Keur Massar", user: "Moussa Sarr", driver: "Mamadou Lamine Diallo", product: "Riz 50kg, Huile, Sucre", items: 5, subtotal: 21000, deliveryFee: 1000, total: 22000, payment: "Cash", paymentStatus: "Payé", orderEarning: 2200, storeEarning: 19800, commissionPct: 10, area: "Pikine", status: "Completed", date: "2026-03-14 18:15:00" },
  { id: 3249, orderId: "#3249", store: "Marché Rufisque", user: "Cheikh Diop", driver: "—", product: "Eau minérale x6", items: 1, subtotal: 2600, deliveryFee: 500, total: 3100, payment: "Cash", paymentStatus: "Remboursé", orderEarning: 0, storeEarning: 0, commissionPct: 10, area: "Rufisque", status: "Cancelled", date: "2026-03-14 15:00:00" },
  { id: 3248, orderId: "#3248", store: "Marché Keur Massar", user: "Rokhaya Sow", driver: "Ibrahima Sarr", product: "Légumes frais, Poisson", items: 4, subtotal: 15000, deliveryFee: 800, total: 15800, payment: "Orange Money", paymentStatus: "Payé", orderEarning: 1580, storeEarning: 14220, commissionPct: 10, area: "Dakar", status: "Completed", date: "2026-03-14 12:00:00" },
]

const stores = Array.from(new Set(earningsData.map((o) => o.store)))

export default function EarningsPage() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [storeFilter, setStoreFilter] = useState("")
  const [orderIdFilter, setOrderIdFilter] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = earningsData.filter((o) => {
    const matchStore = !storeFilter || o.store === storeFilter
    const matchOrder = !orderIdFilter || o.orderId.includes(orderIdFilter)
    return matchStore && matchOrder
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const totalOrderAmount = filtered.reduce((s, o) => s + o.total, 0)
  const merchantEarning = filtered.reduce((s, o) => s + o.orderEarning, 0) // Commission plateforme
  const storeEarning = filtered.reduce((s, o) => s + o.storeEarning, 0)
  const totalDeliveryFees = filtered.reduce((s, o) => s + o.deliveryFee, 0)
  const totalSubtotal = filtered.reduce((s, o) => s + o.subtotal, 0)
  const totalOrders = filtered.filter((o) => o.status === "Completed").length

  const pieData = [
    { name: "Revenus Magasins", value: storeEarning, color: "#FFA114" },
    { name: "Commissions Plateforme", value: merchantEarning, color: "#9333ea" },
    { name: "Frais de Livraison (Livreurs)", value: totalDeliveryFees, color: "#06b6d4" },
  ]

  function reset() { setDateFrom(""); setDateTo(""); setStoreFilter(""); setOrderIdFilter("") }

  function exportCSV() {
    const headers = ["N°", "Commande", "Magasin", "Client", "Livreur", "Produits", "Articles", "Sous-total", "Livraison", "Total", "Paiement", "Statut paiement", "Gains plateform", "Gains magasin", "Commission%", "Zone", "Statut", "Date"]
    const rows = filtered.map((o, i) => [i + 1, o.orderId, o.store, o.user, o.driver, o.product, o.items, o.subtotal, o.deliveryFee, o.total, o.payment, o.paymentStatus, o.orderEarning, o.storeEarning, o.commissionPct + "%", o.area, o.status, o.date])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "rapport_revenus.csv"; a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">📊 Rapport des revenus</h1>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
          <Download size={14} /> Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Du</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-36" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Au</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-36" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Magasin</label>
            <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-52 text-gray-500 focus:outline-none">
              <option value="">-- Tous les magasins --</option>
              {stores.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">N° commande</label>
            <input placeholder="#3253" value={orderIdFilter} onChange={(e) => setOrderIdFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-36" />
          </div>
          <div className="flex gap-2 items-end">
            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
            <button onClick={reset} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Commandes livrées", value: String(totalOrders), color: "bg-blue-500", icon: "🛒" },
          { label: "Montant total commandes", value: `${totalOrderAmount.toLocaleString()} FCFA`, color: "bg-green-500", icon: "💰" },
          { label: "Gains plateforme", value: `${merchantEarning.toLocaleString()} FCFA`, color: "bg-purple-500", icon: "📈" },
          { label: "Gains magasins", value: `${storeEarning.toLocaleString()} FCFA`, color: "bg-orange-500", icon: "🏪" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`w-2 h-8 ${kpi.color} rounded-full mb-3`} />
            <p className="text-xs text-gray-500">{kpi.label}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monétisation Breakdown Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Répartition Financière (Volume Global)</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString()} FCFA`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{item.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 font-bold">Volume Total (GMV)</span>
                  <span className="text-sm font-bold text-blue-600">{totalOrderAmount.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Évolution des Commissions NOOR EAT</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} width={60} />
              <Tooltip 
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(v) => [`${Number(v).toLocaleString()} FCFA`, "Commissions"]} 
              />
              <Bar dataKey="earning" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Détail des revenus par commande</h2>
          <span className="text-xs text-gray-400">{filtered.length} entrée(s)</span>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["N°", "Commande", "Magasin", "Client", "Livreur", "Produits", "Art.", "Sous-total", "Livraison", "Total", "Paiement", "Statut pmt", "Gains plat.", "Gains mag.", "Comm.%", "Zone", "Statut", "Date"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((o, i) => (
              <tr key={o.id} className="hover:bg-gray-50/80">
                <td className="px-3 py-2.5 text-gray-500">{(page - 1) * perPage + i + 1}</td>
                <td className="px-3 py-2.5 text-blue-600 font-semibold cursor-pointer hover:underline">{o.orderId}</td>
                <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{o.store}</td>
                <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{o.user}</td>
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{o.driver}</td>
                <td className="px-3 py-2.5 text-gray-500 max-w-[120px] truncate" title={o.product}>{o.product}</td>
                <td className="px-3 py-2.5 text-gray-700">{o.items}</td>
                <td className="px-3 py-2.5 text-gray-700">{o.subtotal.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-gray-600">{o.deliveryFee.toLocaleString()}</td>
                <td className="px-3 py-2.5 font-semibold text-gray-800">{o.total.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{o.payment}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-1.5 py-0.5 rounded-full font-medium text-[10px] ${o.paymentStatus === "Payé" ? "bg-green-100 text-green-700" : o.paymentStatus === "En attente" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-cyan-600 font-semibold">{o.orderEarning.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-purple-600 font-semibold">{o.storeEarning.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-gray-600">{o.commissionPct}%</td>
                <td className="px-3 py-2.5 text-gray-600">{o.area}</td>
                <td className="px-3 py-2.5"><StatusBadge status={o.status} /></td>
                <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
          <span>Affichage de {(page - 1) * perPage + 1} à {Math.min(page * perPage, filtered.length)} sur {filtered.length} entrées</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">«</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">‹</button>
            <span className="px-2.5 py-1 bg-blue-500 text-white rounded">{page}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">»</button>
          </div>
        </div>
      </div>
    </div>
  )
}
