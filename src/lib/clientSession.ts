export type ClientUser = {
  id: string
  name: string
  email: string
  phone: string | null
  walletMoney: number
}

const TOKEN_KEY = "ne_client_token"
const USER_KEY = "ne_client_user"

export function getClientSession(): { token: string; user: ClientUser } | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  if (!token || !userRaw) return null
  try {
    return { token, user: JSON.parse(userRaw) as ClientUser }
  } catch {
    return null
  }
}

export function setClientSession(token: string, user: ClientUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearClientSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function clientFetch(path: string, options: RequestInit = {}) {
  const session = getClientSession()
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json")
  if (session) headers.set("Authorization", `Bearer ${session.token}`)
  return fetch(path, { ...options, headers })
}
