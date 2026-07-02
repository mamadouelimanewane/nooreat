"use client"

import { useState } from "react"
import StatusBadge from "@/components/ui/StatusBadge"
import { Eye } from "lucide-react"

const mockVehicleGroups = [
  {
    vehicleType: "Moto / Bike",
    icon: "🏍️",
    color: "bg-orange-100 text-orange-700",
    count: 148,
    active: 12,
    drivers: [
      { id: 1973, name: "Bassirou Diao", phone: "+221764082948", plate: "DK-1234-B", status: "Offline" },
      { id: 1951, name: "Abdoul Mohamed Rabo", phone: "+221787876984", plate: "DK-5678-B", status: "Offline" },
      { id: 1910, name: "Mamadou Lamine Diallo", phone: "+221770000001", plate: "DK-9012-B", status: "Online" },
    ],
  },
  {
    vehicleType: "Voiture",
    icon: "🚗",
    color: "bg-blue-100 text-blue-700",
    count: 0,
    active: 0,
    drivers: [],
  },
]

export default function VehicleBasedDriversPage() {
  const [expanded, setExpanded] = useState<string | null>("Moto / Bike")

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
        🚗 Livreurs par type de véhicule
      </h1>

      <div className="space-y-4">
        {mockVehicleGroups.map((group) => (
          <div key={group.vehicleType} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === group.vehicleType ? null : group.vehicleType)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{group.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">{group.vehicleType}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {group.count} livreur(s) total · {group.active} en ligne
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${group.color}`}>
                {group.count} livreurs
              </span>
            </button>

            {expanded === group.vehicleType && group.drivers.length > 0 && (
              <div className="border-t border-gray-100 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["ID", "Nom", "Téléphone", "Plaque", "Statut", "Action"].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {group.drivers.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2 text-blue-600 font-medium">{d.id}</td>
                        <td className="px-4 py-2 text-gray-800 font-medium">{d.name}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{d.phone}</td>
                        <td className="px-4 py-2 text-gray-600 font-mono text-xs">{d.plate}</td>
                        <td className="px-4 py-2"><StatusBadge status={d.status} /></td>
                        <td className="px-4 py-2">
                          <button className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Eye size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {expanded === group.vehicleType && group.drivers.length === 0 && (
              <div className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
                Aucun livreur dans cette catégorie
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
