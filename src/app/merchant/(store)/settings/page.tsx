"use client"

import { useState } from "react"
import { Bell, Shield, Globe, Save, Key } from "lucide-react"

export default function MerchantSettingsPage() {
  const [notifs, setNotifs] = useState({ newOrder: true, orderStatus: true, review: true, payment: true, promo: false })
  const [lang, setLang] = useState("fr")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwdError, setPwdError] = useState("")
  const [pwdSuccess, setPwdSuccess] = useState("")
  const [changingPwd, setChangingPwd] = useState(false)

  async function handleChangePassword() {
    setPwdError("")
    setPwdSuccess("")
    if (newPassword !== confirmPassword) {
      setPwdError("Les mots de passe ne correspondent pas")
      return
    }
    setChangingPwd(true)
    try {
      const res = await fetch("/api/merchant/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwdError(data.message || "Erreur")
        return
      }
      setPwdSuccess("Mot de passe changé avec succès")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } finally {
      setChangingPwd(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-sm text-gray-500">Configuration de votre espace vendeur</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><Bell size={16} /> Notifications</h2>
        <p className="text-xs text-gray-400 mb-4">Choisissez les alertes que vous souhaitez recevoir</p>
        <div className="space-y-3">
          {[
            { key: "newOrder", label: "Nouvelle commande", desc: "Alerte dès qu'une commande arrive" },
            { key: "orderStatus", label: "Changement de statut", desc: "Livraison en cours, commande annulée..." },
            { key: "review", label: "Nouvel avis client", desc: "Quand un client laisse une évaluation" },
            { key: "payment", label: "Paiement reçu", desc: "Confirmation de paiement" },
            { key: "promo", label: "Promotions plateforme", desc: "Offres spéciales NOOR EAT" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-gray-700">{n.label}</div>
                <div className="text-xs text-gray-400">{n.desc}</div>
              </div>
              <button
                onClick={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key as keyof typeof notifs] })}
                className={`relative w-10 h-5 rounded-full transition-colors ${notifs[n.key as keyof typeof notifs] ? "bg-cyan-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[n.key as keyof typeof notifs] ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Shield size={16} /> Sécurité</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1"><Key size={12} /> Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          {pwdError && <p className="text-xs text-red-600">{pwdError}</p>}
          {pwdSuccess && <p className="text-xs text-green-600">{pwdSuccess}</p>}
          <button
            onClick={handleChangePassword}
            disabled={changingPwd || !currentPassword || !newPassword}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            {changingPwd ? "Changement..." : "Changer le mot de passe"}
          </button>
        </div>
      </div>

      {/* Langue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Globe size={16} /> Langue de l&apos;interface</h2>
        <div className="flex gap-2">
          {["fr", "en", "wo"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${lang === l ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {l === "fr" ? "🇫🇷 Français" : l === "en" ? "🇬🇧 English" : "🇸🇳 Wolof"}
            </button>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
        <Save size={16} />
        Sauvegarder
      </button>
    </div>
  )
}
