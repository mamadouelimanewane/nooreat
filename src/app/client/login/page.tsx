"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { setClientSession } from "@/lib/clientSession"
import { SESSION_EVENT } from "../layout"

export default function ClientLoginPage() {
  return (
    <Suspense fallback={null}>
      <ClientLoginForm />
    </Suspense>
  )
}

function ClientLoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Connexion impossible")
        return
      }
      setClientSession(data.token, data.user)
      window.dispatchEvent(new Event(SESSION_EVENT))
      router.push(params.get("from") || "/client")
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
          <p style={{ color: "var(--ne-text-secondary)", fontSize: "13px" }}>Connexion client</p>
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
              <label className="ne-label">E-mail ou téléphone</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ne-text-muted)" }} />
                <input
                  className="ne-input" style={{ paddingLeft: "36px" }}
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>
            <div>
              <label className="ne-label">Mot de passe</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ne-text-muted)" }} />
                <input
                  className="ne-input" style={{ paddingLeft: "36px" }}
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="ne-btn-primary" style={{ justifyContent: "center", marginTop: "6px" }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Se connecter <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "var(--ne-text-muted)", fontSize: "13px", marginTop: "20px" }}>
          Pas encore de compte ? <Link href="/client/register" style={{ color: "var(--ne-accent)" }}>S&apos;inscrire</Link>
        </p>
      </div>
    </div>
  )
}
