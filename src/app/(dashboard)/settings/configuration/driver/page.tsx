"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function DriverConfigPage() {
  const [config, setConfig] = useState({
    minRating: "3.5",
    maxActiveOrders: "3",
    allowMultipleOrders: true,
    cashoutMinAmount: "5000",
    cashoutMaxAmount: "500000",
    cashoutFrequency: "Daily",
    commissionRate: "15",
    bonusPerOrder: "200",
    documentValidityDays: "365",
    autoSuspendOnLowRating: true,
    lowRatingThreshold: "2.5",
  })

  const toggle = (key: string) => setConfig({ ...config, [key]: !(config as any)[key] })

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6">⚙️ Configuration livreurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 pb-2 border-b border-gray-100">Performance & Commandes</h2>
          {[
            { label: "Note minimale requise", key: "minRating" },
            { label: "Max commandes simultanées", key: "maxActiveOrders" },
            { label: "Seuil note faible", key: "lowRatingThreshold" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input value={(config as any)[key]}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}
          {[
            { label: "Commandes multiples autorisées", key: "allowMultipleOrders" },
            { label: "Suspension auto si note faible", key: "autoSuspendOnLowRating" },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{label}</span>
              <button onClick={() => toggle(key)}
                className={`w-10 h-5 rounded-full transition-colors ${(config as any)[key] ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${(config as any)[key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 pb-2 border-b border-gray-100">Paiements & Documents</h2>
          {[
            { label: "Commission (% par commande)", key: "commissionRate" },
            { label: "Bonus par livraison (FCFA)", key: "bonusPerOrder" },
            { label: "Montant min. retrait (FCFA)", key: "cashoutMinAmount" },
            { label: "Montant max. retrait (FCFA)", key: "cashoutMaxAmount" },
            { label: "Validité des documents (jours)", key: "documentValidityDays" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input value={(config as any)[key]}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Fréquence de retrait</label>
            <select value={config.cashoutFrequency} onChange={(e) => setConfig({ ...config, cashoutFrequency: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg">
          <Save size={16} /> Enregistrer
        </button>
      </div>
    </div>
  )
}
