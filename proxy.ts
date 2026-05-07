import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

const intlMiddleware = createMiddleware({
  locales: ["en", "pt", "ja"],
  defaultLocale: "en",
})

export function proxy(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|Logo).*)"],
}
