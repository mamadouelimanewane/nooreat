export type DriverProfile = {
  id: string
  name: string
  phone: string | null
  email: string
  vehicleType: string | null
  rating: number
  totalOrders: number
  walletBalance: number
}

const TOKEN_KEY = "ne_driver_token"
const DRIVER_KEY = "ne_driver_profile"

export function getDriverSession(): { token: string; driver: DriverProfile } | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_KEY)
  const raw = localStorage.getItem(DRIVER_KEY)
  if (!token || !raw) return null
  try {
    return { token, driver: JSON.parse(raw) as DriverProfile }
  } catch {
    return null
  }
}

export function setDriverSession(token: string, driver: DriverProfile) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(DRIVER_KEY, JSON.stringify(driver))
}

export function clearDriverSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(DRIVER_KEY)
}

export async function driverFetch(path: string, options: RequestInit = {}) {
  const session = getDriverSession()
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json")
  if (session) headers.set("Authorization", `Bearer ${session.token}`)
  return fetch(path, { ...options, headers })
}
