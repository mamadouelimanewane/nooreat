import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { verifyAuthToken } from "@/lib/authToken"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    const response = NextResponse.next()

    // Autoriser toutes les origines pour le mobile
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    // Gérer les requêtes OPTIONS (preflight)
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      })
    }

    return response
  }

  if (pathname.startsWith("/merchant")) {
    if (pathname === "/merchant/login") return NextResponse.next()

    const merchantToken = request.cookies.get("merchant_token")?.value
    const storeId = merchantToken ? await verifyAuthToken(merchantToken) : null
    if (!storeId) {
      return NextResponse.redirect(new URL("/merchant/login", request.url))
    }
    return NextResponse.next()
  }

  // Toutes les autres routes matchées ici sont le back-office admin :
  // exiger une session NextAuth valide, sinon rediriger vers /login.
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!login|_next/static|_next/image|favicon.ico).*)",
  ],
}
