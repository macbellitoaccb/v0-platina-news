import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a Supabase client for the middleware
  const supabase = createServerSupabaseClient()

  // Get the user session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // Check if the user is authenticated and if they have an associated author profile with a role
  let isAdmin = false
  if (session?.user) {
    try {
      const { data: authorData, error: authorError } = await supabase
        .from("authors")
        .select("role")
        .eq("user_id", session.user.id)
        .single()

      if (authorData && authorData.role === "admin") {
        isAdmin = true
      }
    } catch (e) {
      console.error("Error fetching author role in middleware:", e)
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session || !isAdmin) {
      // If not logged in or not admin, redirect to login page
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/login"
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect "my profile" route
  if (pathname.startsWith("/meu-perfil")) {
    if (!session) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/login"
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/meu-perfil/:path*"],
}
