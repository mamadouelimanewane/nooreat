import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import OneSignalProvider from "@/components/providers/OneSignalProvider"

const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: "NOOR EAT – Admin Backoffice",
  description: "Plateforme de gestion NOOR EAT — Agrégateur de restaurants et fast-foods à Dakar",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className}`} style={{ background: 'var(--ne-bg-primary)', color: 'var(--ne-text-primary)' }}>
        <OneSignalProvider>{children}</OneSignalProvider>
      </body>
    </html>
  )
}
