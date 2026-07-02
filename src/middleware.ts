import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // On ne gère que les routes /api
  if (request.nextUrl.pathname.startsWith("/api")) {
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

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
