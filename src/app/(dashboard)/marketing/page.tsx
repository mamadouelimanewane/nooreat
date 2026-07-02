"use client"

import { useState } from "react"
import { 
  Megaphone, Users, Gift, Bell, Plus, Sparkles
} from "lucide-react"

import CampaignsView from "./CampaignsView"
import ProfilingView from "./ProfilingView"

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("segments")

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Marketing Hub <Megaphone className="text-rose-500" />
          </h1>
          <p className="text-gray-500 text-sm">Gérez vos campagnes, fidélité et segmentation IA</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shadow-lg shadow-rose-100">
          <Plus size={16} /> Nouvelle Campagne
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { id: "campaigns", label: "Campagnes", icon: Megaphone },
          { id: "notifications", label: "Push & SMS", icon: Bell },
          { id: "loyalty", label: "Programme Fidélité", icon: Gift },
          { id: "segments", label: "Segmentation IA", icon: Sparkles },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "campaigns" && <CampaignsView />}
        {activeTab === "segments" && <ProfilingView />}
        {activeTab === "notifications" && (
          <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-bold text-lg text-gray-800">Push & SMS Hub</p>
            <p className="text-sm">Le système de notification de masse est en cours d'intégration.</p>
          </div>
        )}
        {activeTab === "loyalty" && (
          <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Gift size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-bold text-lg text-gray-800">Programme de Fidélité</p>
            <p className="text-sm">Configuration des points de fidélité et récompenses.</p>
          </div>
        )}
      </div>

    </div>
  )
}
