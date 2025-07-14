import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Trophy, Search, Crown, Medal, Award } from "lucide-react"

interface LeaderboardPageProps {
  searchParams?: Promise<{ q?: string }>
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const { q } = await searchParams || { q: "" }
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { email: { contains: q } },
      ],
    },
    orderBy: { socialScore: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, image: true, socialScore: true },
  })
  
  return (
    <>
      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 mb-6">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/60">Global Leaderboard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Top Performers
              <span className="block text-purple-400">Leaderboard</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See who&apos;s building the most reliable reputation through consistent meeting attendance
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <form method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                name="q"
                placeholder="Search by name or email..."
                defaultValue={q}
                className="w-full pl-10 border-white/20 text-white bg-black/50 backdrop-blur-sm"
              />
            </form>
          </div>

          {/* Leaderboard */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Top 50 Users</h2>
            </div>
            
            <div className="divide-y divide-white/10">
              {users.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  <Search className="w-12 h-12 mx-auto mb-4 text-white/20" />
                  <p>No users found matching your search.</p>
                </div>
              ) : (
                users.map((user: { id: string; name?: string | null; email: string; image?: string | null; socialScore: number }, i: number) => (
                  <Link 
                    key={user.id} 
                    href={`/profiles/${user.id}`} 
                    className="flex items-center gap-4 p-6 hover:bg-white/5 transition group"
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {i === 0 ? (
                        <Crown className="w-8 h-8 text-yellow-400" />
                      ) : i === 1 ? (
                        <Medal className="w-8 h-8 text-gray-300" />
                      ) : i === 2 ? (
                        <Award className="w-8 h-8 text-orange-400" />
                      ) : (
                        <div className={`text-lg font-bold ${i < 10 ? 'text-purple-400' : 'text-white/40'}`}>
                          {i + 1}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {user.image ? (
                        <Image 
                          src={user.image} 
                          alt={user.name || user.email} 
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-white/20 group-hover:border-purple-400/40 transition" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/20 to-orange-400/20 border-2 border-white/20 flex items-center justify-center text-white/60 font-semibold">
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">
                        {user.name || user.email}
                      </div>
                      <div className="text-sm text-white/40 truncate">
                        {user.email}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-extrabold text-purple-400">
                        {user.socialScore}
                      </div>
                      <div className="text-xs text-white/40">pts</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{users.length}</div>
              <div className="text-white/60">Total Users</div>
            </div>
            <div className="border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {users.length > 0 ? users[0].socialScore : 0}
              </div>
              <div className="text-white/60">Highest Score</div>
            </div>
            <div className="border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">
                {users.length > 0 ? Math.round(users.reduce((acc, user) => acc + user.socialScore, 0) / users.length) : 0}
              </div>
              <div className="text-white/60">Average Score</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 