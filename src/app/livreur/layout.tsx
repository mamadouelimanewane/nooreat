"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, History, Wallet, User, LogOut, Menu } from "lucide-react"
import { getDriverSession, clearDriverSession, type DriverProfile } from "@/lib/driverSession"

export const DRIVER_SESSION_EVENT = "ne-driver-session-changed"

const NAV = [
  { href: "/livreur", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/livreur/history", label: "Historique", icon: History },
  { href: "/livreur/earnings", label: "Gains", icon: Wallet },
  { href: "/livreur/profile", label: "Profil", icon: User },
]

export default function LivreurLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [driver, setDriver] = useState<DriverProfile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const refresh = () => setDriver(getDriverSession()?.driver ?? null)
    refresh()
    window.addEventListener(DRIVER_SESSION_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(DRIVER_SESSION_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (pathname === "/livreur/login") return <>{children}</>

  function handleLogout() {
    clearDriverSession()
    window.dispatchEvent(new Event(DRIVER_SESSION_EVENT))
    router.push("/livreur/login")
  }

  return (
    <div className="ne-shell">
      <header className="ne-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {driver && (
            <button
              className="ne-header-btn ne-menu-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              title="Menu"
            >
              <Menu size={18} />
            </button>
          )}
          <Link href="/livreur" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div className="ne-logo-mark">N</div>
            <span className="ne-logo-text">NOOR<span> EAT</span></span>
            <span style={{
              background: "rgba(6,193,103,0.15)", color: "var(--ne-accent)", fontSize: "10px",
              fontWeight: 700, padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.05em", marginLeft: "4px",
            }}>LIVREUR</span>
          </Link>
        </div>
        {driver && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--ne-text-secondary)" }}>{driver.name}</span>
            <button onClick={handleLogout} className="ne-header-btn" title="Déconnexion"><LogOut size={16} /></button>
          </div>
        )}
      </header>
      <div className="ne-layout">
        {driver && (
          <aside className={`ne-sidebar ${sidebarOpen ? "open" : ""}`} style={{ width: "220px" }}>
            <nav className="ne-sidebar-nav">
              {NAV.map((item) => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className={`ne-nav-item ${active ? "active" : ""}`}>
                    <span className="ne-nav-item-icon"><item.icon size={15} /></span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        )}
        {driver && (
          <div
            className={`ne-sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="ne-main">{children}</main>
      </div>
    </div>
  )
}
