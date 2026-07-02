"use client"

import { useEffect } from "react"
import { initOneSignal, ONESIGNAL_APP_ID } from "@/lib/onesignal"

export default function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!ONESIGNAL_APP_ID) return
    initOneSignal().catch(console.error)
  }, [])

  return <>{children}</>
}
