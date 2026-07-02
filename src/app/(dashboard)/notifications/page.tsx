"use client"

import { useState } from "react"
import { Plus, Send, Bell } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockNotifs = [
  { id: 1, title: "Nouvelle Promotion", message: "Profitez de 10% de réduction sur vos commandes ce weekend!", target: "All Users", status: "Sent", sentAt: "2026-03-10 09:00:00" },
  { id: 2, title: "Nouveau Marché Disponible", message: "Marché Keur Massar est maintenant disponible sur NOOR EAT.", target: "Dakar", status: "Sent", sentAt: "2026-02-15 14:30:00" },
  { id: 3, title: "Mise à jour de l'app", message: "Téléchargez la dernière version de NOOR EAT.", target: "All Users", status: "Draft", sentAt: null },
]

export default function NotificationsPage() {
  const [notifs] = useState(mockNotifs)
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><Bell size={18} /> Notifications promotionnelles</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
          <Plus size={14} /> Nouvelle notification
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Créer une notification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Titre</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Titre de la notification..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cible</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Tous les utilisateurs</option>
                <option>Livreurs uniquement</option>
                <option>Dakar</option>
                <option>Rufisque</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 h-24" placeholder="Contenu du message..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"><Send size={14} /> Envoyer</button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg">Enregistrer brouillon</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Titre", "Message", "Cible", "Statut", "Envoyé le"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {notifs.map((n, i) => (
              <tr key={n.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{n.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{n.message}</td>
                <td className="px-4 py-3 text-xs bg-blue-50 text-blue-600 rounded font-medium">{n.target}</td>
                <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-500">{n.sentAt ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
