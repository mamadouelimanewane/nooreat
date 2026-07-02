"use client"

import { useState } from "react"
import { Search, RefreshCw } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockVehicleList = [
  { id: 1, driver: "Mamadou Lamine Diallo", phone: "+221770000001", type: "Moto", brand: "Honda", model: "CB125", plate: "DK-1234-AB", year: 2022, color: "Rouge", status: "Approved" },
  { id: 2, driver: "Ibrahima Sarr", phone: "+221776543210", type: "Moto", brand: "Yamaha", model: "FZ150", plate: "DK-5678-CD", year: 2021, color: "Bleu", status: "Approved" },
  { id: 3, driver: "Bassirou Diao", phone: "+221764082948", type: "Vélo", brand: "Trek", model: "FX3", plate: "—", year: 2023, color: "Noir", status: "Pending" },
  { id: 4, driver: "Abdoul Mohamed Rabo", phone: "+221787876984", type: "Moto", brand: "Suzuki", model: "GS150", plate: "DK-9012-EF", year: 2020, color: "Gris", status: "Rejected" },
]

export default function VehicleListPage() {
  const [search, setSearch] = useState("")
  const filtered = mockVehicleList.filter(v =>
    !search || v.driver.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>🚗</span> Tous les véhicules</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex gap-3 items-center">
          <input placeholder="Livreur ou plaque..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <button onClick={() => setSearch("")} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Livreur", "Type", "Marque / Modèle", "Plaque", "Année", "Couleur", "Statut"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((v, i) => (
              <tr key={v.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{v.driver}</div>
                  <div className="text-xs text-gray-500">{v.phone}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{v.type}</td>
                <td className="px-4 py-3 text-gray-700">{v.brand} {v.model}</td>
                <td className="px-4 py-3 font-mono text-gray-700">{v.plate}</td>
                <td className="px-4 py-3 text-gray-600">{v.year}</td>
                <td className="px-4 py-3 text-gray-600">{v.color}</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-xs text-gray-400 border-t">Affichage de {filtered.length} sur {mockVehicleList.length} entrées</div>
      </div>
    </div>
  )
}
