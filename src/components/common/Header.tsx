import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Menu, X } from "lucide-react"
import Logo from "./Logo"
import { useState } from "react"

interface HeaderProps {
  showSignIn?: boolean
  currentPage?: 'home' | 'leaderboard' | 'profiles' | 'profile'
}

export default function Header({ showSignIn = true, currentPage }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
        <Logo size={{ sm: "md", md: "lg" }} />
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-5">
            <Link
              href="/leaderboard"
              className={`transition flex items-center gap-2 ${currentPage === 'leaderboard'
                  ? 'text-purple-400'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
            <Link
              href="/profiles"
              className={`transition flex items-center gap-2 ${currentPage === 'profiles' || currentPage === 'profile'
                  ? 'text-purple-400'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              <Users className="w-4 h-4" />
              Profiles
            </Link>
          </div>
          {showSignIn && (
            <Button asChild variant="outline" className="border border-purple-400/40 text-black hover:bg-purple-400/10 hover:text-white">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur flex flex-col items-center justify-start pt-24 gap-8 animate-fade-in">
          <Link
            href="/leaderboard"
            className={`transition flex items-center gap-2 text-lg ${currentPage === 'leaderboard'
                ? 'text-purple-400'
                : 'text-white/80 hover:text-white'
              }`}
            onClick={() => setMobileOpen(false)}
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </Link>
          <Link
            href="/profiles"
            className={`transition flex items-center gap-2 text-lg ${currentPage === 'profiles' || currentPage === 'profile'
                ? 'text-purple-400'
                : 'text-white/80 hover:text-white'
              }`}
            onClick={() => setMobileOpen(false)}
          >
            <Users className="w-5 h-5" />
            Profiles
          </Link>
          {showSignIn && (
            <Button asChild variant="outline" className="w-48 border border-purple-400/40 text-black hover:bg-purple-400/10 hover:text-white text-lg" onClick={() => setMobileOpen(false)}>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  )
} 