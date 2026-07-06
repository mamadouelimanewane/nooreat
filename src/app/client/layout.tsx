"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Home, ShoppingBag, ClipboardList, LogOut, User } from "lucide-react"
import { getClientSession, clearClientSession, type ClientUser } from "@/lib/clientSession"
import { getCart, cartCount } from "@/lib/clientCart"

export const SESSION_EVENT = "ne-client-session-changed"
export const CART_EVENT = "ne-client-cart-changed"

const TABS = [
  { href: "/client", label: "Accueil", icon: Home, exact: true },
  { href: "/client/orders", label: "Commandes", icon: ClipboardList, exact: false },
  { href: "/client/cart", label: "Panier", icon: ShoppingBag, exact: false },
  { href: "/client/wallet", label: "Compte", icon: User, exact: false },
] as const

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
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
    <div className="noor-client-scope min-h-screen">
      <header className="sticky top-0 z-40 bg-[#fff] border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/client" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-full bg-[#06C167] flex items-center justify-center text-black font-black text-sm">N</span>
            <span className="font-black text-lg tracking-tight hidden sm:inline">NOOR EAT</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/client/orders" className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-neutral-700 hover:bg-neutral-100 transition" title="Mes commandes">
              <ClipboardList size={19} />
            </Link>
            <Link href="/client/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition" title="Panier">
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <Link href="/client/wallet" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 px-3 py-2 rounded-full transition">
                  <User size={14} /> {user.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-neutral-700 hover:bg-neutral-100 transition" title="Déconnexion">
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <Link href="/client/login" className="ml-1 bg-black text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 transition">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pb-20 sm:pb-0">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fff]/95 backdrop-blur border-t border-neutral-100 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 h-16">
          {TABS.map((tab) => {
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition ${
                  active ? "text-black" : "text-neutral-400"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {tab.label}
                {tab.href === "/client/cart" && count > 0 && (
                  <span className="absolute top-1.5 right-[calc(50%-20px)] min-w-[16px] h-[16px] px-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
