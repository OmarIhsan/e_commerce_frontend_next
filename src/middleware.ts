import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/checkout", "/account"]

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get("customer_session_token")?.value

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout/:path*", "/account/:path*"],
}
