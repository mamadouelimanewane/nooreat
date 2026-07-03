"use client"

import { useEffect, useState } from "react"
import { Save, MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react"

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

type DayHours = { day: string; open: boolean; from: string; to: string }

type Profile = {
  name: string
  description: string
  phone: string
  email: string
  address: string
  minOrder: string
  deliveryFee: string
  deliveryTimeMinutes: string
}

const defaultHours: DayHours[] = days.map((d) => ({ day: d, open: d !== "Dimanche", from: "08:00", to: "22:00" }))

export default function MerchantProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "", description: "", phone: "", email: "", address: "", minOrder: "", deliveryFee: "", deliveryTimeMinutes: "",
  })
  const [hours, setHours] = useState<DayHours[]>(defaultHours)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/merchant/profile")
      .then((r) => r.json())
      .then((data) => {
        const s = data.store
        setProfile({
          name: s.name ?? "",
          description: s.description ?? "",
          phone: s.phone ?? "",
          email: s.email ?? "",
          address: s.address ?? "",
          minOrder: s.minOrder?.toString() ?? "",
          deliveryFee: s.deliveryFee?.toString() ?? "",
          deliveryTimeMinutes: s.deliveryTimeMinutes ?? "",
        })
        if (Array.isArray(s.openingHours) && s.openingHours.length === 7) {
          setHours(s.openingHours)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch("/api/merchant/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          description: profile.description,
          phone: profile.phone,
          address: profile.address,
          minOrder: profile.minOrder ? Number(profile.minOrder) : null,
          deliveryFee: profile.deliveryFee ? Number(profile.deliveryFee) : null,
          deliveryTimeMinutes: profile.deliveryTimeMinutes,
          openingHours: hours,
        }),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 size={28} className="text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Profil du magasin</h1>
        <p className="text-sm text-gray-500">Informations visibles par vos clients</p>
      </div>

      {/* Infos générales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Informations générales</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nom du magasin</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1"><Phone size={12} /> Téléphone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1"><Mail size={12} /> Email</label>
              <input
                value={profile.email}
                disabled
                title="L'email de connexion ne peut pas être modifié ici"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1"><MapPin size={12} /> Adresse</label>
            <input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
        </div>
      </div>

      {/* Livraison */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Paramètres de livraison</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Commande min. (FCFA)</label>
            <input
              value={profile.minOrder}
              onChange={(e) => setProfile({ ...profile, minOrder: e.target.value })}
              type="number"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Frais livraison (FCFA)</label>
            <input
              value={profile.deliveryFee}
              onChange={(e) => setProfile({ ...profile, deliveryFee: e.target.value })}
              type="number"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Délai (min)</label>
            <input
              value={profile.deliveryTimeMinutes}
              onChange={(e) => setProfile({ ...profile, deliveryTimeMinutes: e.target.value })}
              placeholder="30-45"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
        </div>
      </div>

      {/* Horaires */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Clock size={16} /> Horaires d&apos;ouverture</h2>
        <div className="space-y-2.5">
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium text-gray-700">{h.day}</div>
              <button
                onClick={() => setHours(hours.map((x, j) => (j === i ? { ...x, open: !x.open } : x)))}
                className={`relative w-10 h-5 rounded-full transition-colors ${h.open ? "bg-cyan-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${h.open ? "left-5" : "left-0.5"}`} />
              </button>
              {h.open ? (
                <>
                  <input
                    type="time"
                    value={h.from}
                    onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, from: e.target.value } : x)))}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                  <span className="text-gray-400 text-xs">—</span>
                  <input
                    type="time"
                    value={h.to}
                    onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, to: e.target.value } : x)))}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </>
              ) : (
                <span className="text-xs text-gray-400">Fermé</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Save size={16} />
          {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
        </button>
        {saved && <span className="text-sm text-green-600">Enregistré ✓</span>}
      </div>
    </div>
  )
}
