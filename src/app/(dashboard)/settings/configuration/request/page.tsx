"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function RequestConfigPage() {
  const [config, setConfig] = useState({
    autoAssign: true,
    assignRadius: "5",
    maxDriverSearch: "10",
    searchTimeout: "60",
    driverAcceptTimeout: "30",
    allowScheduled: true,
    scheduledAdvanceHours: "24",
    maxItemsPerOrder: "50",
    allowTips: true,
    tipOptions: "5,10,15,20",
  })

  const toggle = (key: string) => setConfig({ ...config, [key]: !(config as any)[key] })

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6">⚙️ Configuration des requêtes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 pb-2 border-b border-gray-100">Attribution des livreurs</h2>

          {[
            { label: "Rayon de recherche (km)", key: "assignRadius" },
            { label: "Nb max de livreurs contactés", key: "maxDriverSearch" },
            { label: "Délai de recherche (sec)", key: "searchTimeout" },
            { label: "Délai d'acceptation livreur (sec)", key: "driverAcceptTimeout" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input type="number" value={(config as any)[key]}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Attribution automatique</span>
            <button onClick={() => toggle("autoAssign")}
              className={`w-10 h-5 rounded-full transition-colors ${config.autoAssign ? "bg-green-500" : "bg-gray-300"}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${config.autoAssign ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 pb-2 border-b border-gray-100">Options de commande</h2>

          {[
            { label: "Nb max d'articles par commande", key: "maxItemsPerOrder" },
            { label: "Options de pourboire (%, séparés par virgule)", key: "tipOptions" },
            { label: "Avance min. pour commande planifiée (h)", key: "scheduledAdvanceHours" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input value={(config as any)[key]}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}

          {[
            { label: "Commandes planifiées", key: "allowScheduled" },
            { label: "Pourboires", key: "allowTips" },
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
      </div>

      <div className="mt-6">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg">
          <Save size={16} /> Enregistrer
        </button>
      </div>
    </div>
  )
}
