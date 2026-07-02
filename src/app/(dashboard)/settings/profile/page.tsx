"use client"

import { useState } from "react"

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "Mamadou Dia",
    email: "mamadou.dia@NOOR EAT.com",
    phone: "+221 77 123 45 67",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2"><span>👤</span> Mon profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Informations personnelles</h2>
          <div className="space-y-4">
            {[
              { label: "Nom complet", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Téléphone", key: "phone", type: "tel" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                <input type={f.type} value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2">Enregistrer</button>
          </div>
        </div>

        {/* Changer mot de passe */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Changer le mot de passe</h2>
          <div className="space-y-4">
            {[
              { label: "Mot de passe actuel", key: "currentPassword" },
              { label: "Nouveau mot de passe", key: "newPassword" },
              { label: "Confirmer le nouveau mot de passe", key: "confirmPassword" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                <input type="password" value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
            <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 mt-2">Mettre à jour</button>
          </div>
        </div>
      </div>
    </div>
  )
}
