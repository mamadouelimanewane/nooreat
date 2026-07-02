"use client"

import { useState } from "react"
import { Search, Edit2, Save, X } from "lucide-react"

const mockModules = [
  { key: "module.orders", label: "Commandes", enabled: true },
  { key: "module.wallet", label: "Portefeuille", enabled: true },
  { key: "module.chat", label: "Chat en direct", enabled: false },
  { key: "module.loyalty", label: "Programme fidélité", enabled: false },
  { key: "module.reviews", label: "Avis & Notes", enabled: true },
  { key: "module.referral", label: "Parrainage", enabled: true },
  { key: "module.subscription", label: "Abonnements", enabled: false },
]

const mockStrings: Record<string, { key: string; value: string }[]> = {
  "module.orders": [
    { key: "orders.title", value: "Mes commandes" },
    { key: "orders.empty", value: "Aucune commande pour le moment" },
    { key: "orders.track", value: "Suivre ma commande" },
  ],
  "module.wallet": [
    { key: "wallet.title", value: "Mon portefeuille" },
    { key: "wallet.balance", value: "Solde disponible" },
    { key: "wallet.recharge", value: "Recharger" },
  ],
  "module.reviews": [
    { key: "reviews.title", value: "Avis clients" },
    { key: "reviews.write", value: "Laisser un avis" },
    { key: "reviews.thanks", value: "Merci pour votre avis !" },
  ],
  "module.referral": [
    { key: "referral.title", value: "Parrainez vos amis" },
    { key: "referral.code", value: "Votre code parrain" },
    { key: "referral.bonus", value: "Bonus de parrainage" },
  ],
}

export default function ModuleStringsPage() {
  const [search, setSearch] = useState("")
  const [activeModule, setActiveModule] = useState("module.orders")
  const [editId, setEditId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [data, setData] = useState(mockStrings)

  const currentStrings = (data[activeModule] || []).filter(s =>
    !search || s.key.includes(search) || s.value.toLowerCase().includes(search.toLowerCase())
  )

  const saveEdit = (key: string) => {
    setData(prev => ({
      ...prev,
      [activeModule]: (prev[activeModule] || []).map(s => s.key === key ? { ...s, value: editValue } : s),
    }))
    setEditId(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        🧩 Chaînes des modules
      </h1>

      <div className="flex gap-4">
        {/* Liste des modules */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600">MODULES</div>
            {mockModules.map(m => (
              <button
                key={m.key}
                onClick={() => { setActiveModule(m.key); setEditId(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border-b border-gray-50 hover:bg-blue-50 ${activeModule === m.key ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
              >
                <span>{m.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${m.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {m.enabled ? "Actif" : "Inactif"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Strings du module actif */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex gap-3">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
              />
              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            {currentStrings.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">Aucune chaîne trouvée pour ce module</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Clé", "Valeur", "Action"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentStrings.map(s => (
                    <tr key={s.key} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600 w-64">{s.key}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {editId === s.key ? (
                          <input value={editValue} onChange={e => setEditValue(e.target.value)}
                            className="border border-blue-300 rounded px-2 py-1 text-sm w-full focus:outline-none" />
                        ) : s.value}
                      </td>
                      <td className="px-4 py-3">
                        {editId === s.key ? (
                          <div className="flex gap-1">
                            <button onClick={() => saveEdit(s.key)} className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Save size={13} /></button>
                            <button onClick={() => setEditId(null)} className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"><X size={13} /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditId(s.key); setEditValue(s.value) }} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit2 size={13} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
