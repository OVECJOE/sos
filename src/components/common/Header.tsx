import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Users } from "lucide-react"
import Logo from "./Logo"

interface HeaderProps {
  showSignIn?: boolean
  currentPage?: 'home' | 'leaderboard' | 'profiles' | 'profile'
}

export default function Header({ showSignIn = true, currentPage }: HeaderProps) {
  return (
    <nav className="border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
        <Logo size="md" />
        <div className="flex items-center gap-8">
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
      </div>
    </nav>
  )
} 