"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingCart, Wallet, ClipboardList, LogOut, User } from "lucide-react"
import { getClientSession, clearClientSession, type ClientUser } from "@/lib/clientSession"
import { getCart, cartCount } from "@/lib/clientCart"

export const SESSION_EVENT = "ne-client-session-changed"
export const CART_EVENT = "ne-client-cart-changed"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<ClientUser | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const refresh = () => {
      setUser(getClientSession()?.user ?? null)
      setCount(cartCount(getCart()))
    }
    refresh()
    window.addEventListener(SESSION_EVENT, refresh)
    window.addEventListener(CART_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(SESSION_EVENT, refresh)
      window.removeEventListener(CART_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  function handleLogout() {
    clearClientSession()
    window.dispatchEvent(new Event(SESSION_EVENT))
    router.push("/client")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--ne-bg-primary)" }}>
      <header className="ne-header" style={{ position: "sticky" }}>
        <Link href="/client" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div className="ne-logo-mark">N</div>
          <span className="ne-logo-text">NOOR<span> EAT</span></span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/client/orders" className="ne-header-btn" title="Mes commandes">
            <ClipboardList size={17} />
          </Link>
          <Link href="/client/wallet" className="ne-header-btn" title="Portefeuille">
            <Wallet size={17} />
          </Link>
          <Link href="/client/cart" className="ne-header-btn" title="Panier" style={{ position: "relative" }}>
            <ShoppingCart size={17} />
            {count > 0 && (
              <span style={{
                position: "absolute", top: "2px", right: "2px", background: "var(--ne-accent)",
                color: "#000", fontSize: "10px", fontWeight: 800, borderRadius: "999px",
                minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
              }}>{count}</span>
            )}
          </Link>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
              <span style={{
                fontSize: "12px", color: "var(--ne-text-secondary)", display: "flex",
                alignItems: "center", gap: "6px",
              }}>
                <User size={14} /> {user.name.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className="ne-header-btn" title="Déconnexion">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/client/login" className="ne-btn-primary" style={{ marginLeft: "8px", padding: "8px 16px", fontSize: "13px" }}>
              Se connecter
            </Link>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
