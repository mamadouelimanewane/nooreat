"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from "lucide-react"
import { setClientSession } from "@/lib/clientSession"
import { SESSION_EVENT } from "../layout"

export default function ClientRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Inscription impossible")
        return
      }
      setClientSession(data.token, data.user)
      window.dispatchEvent(new Event(SESSION_EVENT))
      router.push("/client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ne-login-bg">
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="ne-logo-mark" style={{ margin: "0 auto 14px", width: "56px", height: "56px", fontSize: "24px" }}>N</div>
          <h1 style={{ fontSize: "22px" }}>NOOR <span style={{ color: "var(--ne-accent)" }}>EAT</span></h1>
          <p style={{ color: "var(--ne-text-secondary)", fontSize: "13px" }}>Créer un compte client</p>
        </div>

        <div className="ne-login-card">
          {error && (
            <div style={{
              marginBottom: "16px", padding: "10px 14px", background: "rgba(240,62,62,0.12)",
              border: "1px solid rgba(240,62,62,0.3)", borderRadius: "10px", color: "#f03e3e", fontSize: "13px",
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="ne-label">Nom complet</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ne-text-muted)" }} />
                <input className="ne-input" style={{ paddingLeft: "36px" }} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Fatou Diop" />
              </div>
            </div>
            <div>
              <label className="ne-label">E-mail</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ne-text-muted)" }} />
                <input className="ne-input" style={{ paddingLeft: "36px" }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" />
              </div>
            </div>
            <div>
              <label className="ne-label">Téléphone</label>
              <div style={{ position: "relative" }}>
                <Phone size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ne-text-muted)" }} />
                <input className="ne-input" style={{ paddingLeft: "36px" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 123 45 67" />
              </div>
            </div>
            <div>
              <label className="ne-label">Mot de passe</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ne-text-muted)" }} />
                <input className="ne-input" style={{ paddingLeft: "36px" }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="ne-btn-primary" style={{ justifyContent: "center", marginTop: "6px" }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Créer mon compte <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "var(--ne-text-muted)", fontSize: "13px", marginTop: "20px" }}>
          Déjà un compte ? <Link href="/client/login" style={{ color: "var(--ne-accent)" }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
