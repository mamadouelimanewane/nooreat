// Uses the Web Crypto API (global `crypto.subtle`) rather than Node's `crypto`
// module so this works both in API routes (Node runtime) and in middleware
// (Edge runtime), which doesn't support Node built-ins.

const encoder = new TextEncoder()

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_TOKEN_SECRET
  if (!secret) {
    throw new Error("AUTH_TOKEN_SECRET is not set — required to sign/verify auth tokens")
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/")
  while (b64.length % 4) b64 += "="
  return atob(b64)
}

export async function signAuthToken(id: string): Promise<string> {
  const key = await getKey()
  const payload = `${id}.${Date.now()}`
  const signatureBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return base64UrlEncode(`${payload}.${toHex(signatureBuf)}`)
}

export async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    const decoded = base64UrlDecode(token)
    const parts = decoded.split(".")
    if (parts.length !== 3) return null
    const [id, timestamp, signature] = parts

    const payload = `${id}.${timestamp}`
    const key = await getKey()
    const valid = await crypto.subtle.verify("HMAC", key, fromHex(signature), encoder.encode(payload))

    return valid ? id : null
  } catch {
    return null
  }
}
