"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="ne-shell">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="ne-layout">
        <Sidebar open={sidebarOpen} />
        <div
          className={`ne-sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <main className="ne-main">{children}</main>
      </div>
    </div>
  )
}
