"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GamepadIcon as GameController, Menu, X, Search, User, LogOut } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { logout } from "@/app/actions"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClientSupabaseClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        // Fetch author role
        const { data: authorData, error } = await supabase
          .from("authors")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
        setIsAdmin(authorData?.role === "admin")
      } else {
        setIsAdmin(false)
      }
    })

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from("authors")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data: authorData, error }) => {
            setIsAdmin(authorData?.role === "admin")
          })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login") // Ensure redirect after logout
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        {/* Top bar with logo */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <GameController className="h-8 w-8 text-primary" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-purple-500 glow"></div>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent gamer-gradient">
              PLATINA<span className="text-white">NEWS</span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary">
              Home
            </Link>
            <Link
              href="/reviews"
              className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary"
            >
              Reviews
            </Link>
            <Link
              href="/noticias"
              className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary"
            >
              Notícias
            </Link>
            <Link
              href="/guias"
              className="text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary"
            >
              Guias
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <User className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
                <Link href="/meu-perfil">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </nav>
        </div>

        {/* Category bar - visible on desktop */}
        <div className="hidden md:flex items-center justify-between border-t border-border/50 py-2">
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              PS5
            </Link>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              XBOX
            </Link>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              SWITCH
            </Link>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              PC
            </Link>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              MOBILE
            </Link>
            <div className="h-4 border-r border-border/50"></div>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              LANÇAMENTOS
            </Link>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              ANÁLISES
            </Link>
            <Link href="#" className="text-xs font-medium text-muted-foreground hover:text-primary">
              GUIAS
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">
              EDIÇÃO {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="flex flex-col p-4 gap-4">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/reviews"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/noticias"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Notícias
              </Link>
              <Link
                href="/guias"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Guias
              </Link>
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <User className="h-4 w-4" />
                        <span>Admin</span>
                      </Button>
                    </Link>
                  )}
                  <Link href="/meu-perfil" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
