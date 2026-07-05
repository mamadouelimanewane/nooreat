"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { getDriverSession, driverFetch, setDriverSession } from "@/lib/driverSession"

export default function LivreurProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!getDriverSession()) {
      router.push("/livreur/login")
      return
    }
    driverFetch("/api/driver/profile").then((r) => r.json()).then((d) => {
      setName(d.name || "")
      setPhone(d.phone || "")
      setVehicleType(d.vehicleType || "")
      setEmail(d.email || "")
      setLoading(false)
    })
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const res = await driverFetch("/api/driver/profile", { method: "PUT", body: JSON.stringify({ name, phone, vehicleType }) })
      const data = await res.json()
      const session = getDriverSession()
      if (session) setDriverSession(session.token, data)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="ne-skeleton" style={{ height: "200px", maxWidth: "500px", margin: "0 auto" }} />

  return (
    <div style={{ maxWidth: "460px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>Mon profil</h1>
      <form onSubmit={handleSave} className="ne-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label className="ne-label">Nom</label>
          <input className="ne-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="ne-label">E-mail</label>
          <input className="ne-input" value={email} disabled style={{ opacity: 0.6 }} />
        </div>
        <div>
          <label className="ne-label">Téléphone</label>
          <input className="ne-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="ne-label">Type de véhicule</label>
          <input className="ne-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Moto, vélo, voiture..." />
        </div>
        <button type="submit" disabled={saving} className="ne-btn-primary" style={{ justifyContent: "center", marginTop: "6px" }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Enregistrer</>}
        </button>
        {saved && <p style={{ color: "var(--ne-accent)", fontSize: "13px", textAlign: "center" }}>Profil mis à jour.</p>}
      </form>
    </div>
  )
}
