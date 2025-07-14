import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Users, Search, Mail, Award } from "lucide-react"

interface ProfilesPageProps {
  searchParams?: Promise<{ q?: string; page?: string }>
}

export default async function ProfilesPage({ searchParams }: ProfilesPageProps) {
  const { q = "", page = "1" } = await searchParams || {}
  const pageNumber = parseInt(page, 10)
  const pageSize = 20
  const skip = (pageNumber - 1) * pageSize
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      },
      orderBy: { socialScore: "desc" },
      skip,
      take: pageSize,
      select: { id: true, name: true, email: true, image: true, socialScore: true },
    }),
    prisma.user.count({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      },
    }),
  ])
  
  const totalPages = Math.ceil(total / pageSize)
  
  return (
    <>
      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 mb-6">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/60">User Directory</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Discover
              <span className="block text-purple-400">Profiles</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Browse through our community of professionals and see their reliability scores
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

          {/* User Grid */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Users</h2>
                <div className="text-sm text-white/60">
                  {total} total users
                </div>
              </div>
            </div>
            
            {users.length === 0 ? (
              <div className="p-12 text-center text-white/60">
                <Search className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-lg mb-2">No users found</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {users.map((user: { id: string; name?: string | null; email: string; image?: string | null; socialScore: number }) => (
                  <Link 
                    key={user.id} 
                    href={`/profiles/${user.id}`} 
                    className="group block"
                  >
                    <div className="border border-white/10 p-6 hover:bg-white/5 transition rounded-lg">
                      {/* Avatar */}
                      <div className="flex items-center gap-4 mb-4">
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
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">
                            {user.name || user.email}
                          </div>
                          <div className="text-sm text-white/40 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-white/60">Score</span>
                        </div>
                        <div className="text-2xl font-extrabold text-purple-400">
                          {user.socialScore}
                        </div>
                      </div>

                      {/* Score indicator */}
                      <div className="mt-3">
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-orange-400 transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, Math.max(0, ((user.socialScore - 300) / (850 - 300)) * 100))}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/40 mt-1">
                          <span>300</span>
                          <span>850</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Link
                    key={i}
                    href={`?q=${encodeURIComponent(q)}&page=${i + 1}`}
                    className={`px-4 py-2 border rounded-lg transition ${
                      pageNumber === i + 1 
                        ? "border-purple-400 text-purple-400 bg-purple-400/10" 
                        : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{total}</div>
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