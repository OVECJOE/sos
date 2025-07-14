import { prisma } from "@/lib/prisma"
import SocialScoreCard from "@/components/dashboard/SocialScoreCard"
import CreditsCard from "@/components/dashboard/CreditsCard"
import ActionButtons from "@/components/dashboard/ActionButtons"
import RecentMeetingsList from "@/components/dashboard/RecentMeetingsList"
import { Attendee, Meeting } from "@/types/meeting"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      createdMeetings: {
        orderBy: { scheduledStart: "desc" },
        take: 5,
      },
      attendeeRecords: {
        include: { meeting: true },
        orderBy: { invitedAt: "desc" },
        take: 5,
      },
    },
  })
  if (!user) return null

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-8 flex flex-col gap-10">
      {/* Greeting */}
      <section className="flex flex-col gap-2 items-center text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Welcome, <span className="text-purple-400">{user.name?.split(' ')[0] || 'User'}</span></h1>
        <p className="text-white/60 text-base md:text-lg max-w-xl">Your personal dashboard for meetings, social score, and credits. Stay accountable, build trust, and grow your reputation.</p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard label="Meetings" value={user.createdMeetings.length} accent="purple" />
        <StatCard label="Attended" value={user.attendeeRecords.length} accent="orange" />
        <StatCard label="Score" value={user.socialScore} accent="teal" />
        <StatCard label="Credits" value={user.credits} accent="red" />
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* Left: Profile & Actions */}
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          <div className="bg-black/70 border border-white/10 rounded-2xl shadow p-6 md:p-8">
            <SocialScoreCard score={user.socialScore} />
          </div>
          <div className="bg-black/70 border border-white/10 rounded-2xl shadow p-6 md:p-8">
            <CreditsCard credits={user.credits} />
          </div>
          <ActionButtons />
        </div>
        {/* Right: Recent Meetings */}
        <div className="bg-black/70 border border-white/10 rounded-2xl shadow p-4 flex flex-col gap-6">
          <RecentMeetingsList
            meetings={user.createdMeetings as Meeting[]}
            attended={user.attendeeRecords as (Attendee & { meeting?: Meeting | undefined })[]}
          />
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: "purple" | "orange" | "teal" | "red" }) {
  const colorMap: Record<string, string> = {
    purple: "text-purple-400 bg-purple-400/10",
    orange: "text-orange-400 bg-orange-400/10",
    teal: "text-teal-400 bg-teal-400/10",
    red: "text-red-400 bg-red-400/10",
  }
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/60 shadow p-4 md:p-6 gap-1 min-w-[80px] ${colorMap[accent]}`}> 
      <div className={`text-2xl md:text-3xl font-bold ${colorMap[accent].split(' ')[0]}`}>{value}</div>
      <div className="text-xs md:text-sm text-white/60 font-medium uppercase tracking-widest">{label}</div>
    </div>
  )
} 