"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaintRoller as GameController, Menu, X, Search } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          </nav>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
