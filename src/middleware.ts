import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from '@/types/supabase'

const PUBLIC_ROUTES = ["/auth/signin", "/auth/signup", "/auth/callback"]
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(req.nextUrl.pathname)

  // If the user is on an auth route but already authenticated,
  // redirect them to the dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If the user is not authenticated and trying to access a protected route,
  // redirect them to the sign-in page
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL("/auth/signin", req.url)
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Update session if it exists
  if (session) {
    await supabase.auth.setSession(session)
  }

  return res
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
