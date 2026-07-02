import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="ne-shell">
      <Header />
      <div className="ne-layout">
        <Sidebar />
        <main className="ne-main">{children}</main>
      </div>
    </div>
  )
}
