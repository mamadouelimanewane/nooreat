"use client"

import { useState } from "react"
import { Edit, Eye } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockTemplates = [
  { id: 1, name: "Bienvenue utilisateur", event: "user_register", subject: "Bienvenue sur NOOR EAT !", status: "Active" },
  { id: 2, name: "Confirmation commande", event: "order_placed", subject: "Commande #{order_id} confirmée", status: "Active" },
  { id: 3, name: "Commande livrée", event: "order_delivered", subject: "Votre commande a été livrée", status: "Active" },
  { id: 4, name: "Réinitialisation mot de passe", event: "password_reset", subject: "Réinitialiser votre mot de passe", status: "Active" },
  { id: 5, name: "Inscription livreur", event: "driver_register", subject: "Compte livreur créé", status: "Active" },
  { id: 6, name: "Documents approuvés", event: "driver_approved", subject: "Vos documents ont été approuvés", status: "Active" },
  { id: 7, name: "Documents rejetés", event: "driver_rejected", subject: "Documents refusés — action requise", status: "Inactive" },
]

export default function EmailTemplatesPage() {
  const [preview, setPreview] = useState<typeof mockTemplates[0] | null>(null)

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6">⚙️ Modèles d'email</h1>

      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-800">{preview.name}</h2>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div><span className="text-xs text-gray-500">Événement :</span> <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{preview.event}</code></div>
              <div><span className="text-xs text-gray-500">Sujet :</span> <span className="text-sm font-medium">{preview.subject}</span></div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 min-h-[120px]">
                <p>Bonjour [Prénom],</p>
                <br />
                <p>Ceci est un aperçu du modèle <strong>{preview.name}</strong>.</p>
                <br />
                <p>L'équipe NOOR EAT</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setPreview(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Fermer</button>
              <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">Modifier</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom du template", "Événement", "Sujet", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockTemplates.map((t, i) => (
              <tr key={t.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{t.name}</td>
                <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{t.event}</code></td>
                <td className="px-4 py-3 text-gray-600 text-xs">{t.subject}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button onClick={() => setPreview(t)} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"><Eye size={12} /></button>
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
