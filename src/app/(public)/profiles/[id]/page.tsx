import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, Award, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { id: (await params).id },
    include: {
      createdMeetings: { orderBy: { scheduledStart: "desc" }, take: 5 },
      attendeeRecords: {
        include: { meeting: true },
        orderBy: { invitedAt: "desc" },
        take: 5,
      },
    },
  })
  
  if (!user) notFound()
  
  const totalMeetings = user.attendeeRecords.length
  const attendedMeetings = await prisma.attendance.count({ where: { userId: user.id } })
  const confirmedMeetings = user.attendeeRecords.filter((a: { status: string }) => a.status === "CONFIRMED").length
  const noShowMeetings = user.attendeeRecords.filter((a: { status: string }) => a.status === "NO_SHOW").length
  const attendanceRate = totalMeetings > 0 ? (attendedMeetings / totalMeetings) * 100 : 0
  const confirmationRate = totalMeetings > 0 ? (confirmedMeetings / totalMeetings) * 100 : 0
  
  return (
    <>
      {/* Profile Content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href="/profiles" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Profiles
            </Link>
          </div>

          {/* Profile Header */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || user.email} 
                    width={120}
                    height={120}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20" 
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-400/20 to-orange-400/20 border-4 border-white/20 flex items-center justify-center text-white/60 font-bold text-2xl">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {user.name || user.email}
                </h1>
                <p className="text-lg text-white/60 mb-4">{user.email}</p>
                
                {/* Social Score */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-widest text-purple-400/80 mb-1">Social Score</div>
                    <div className="text-5xl font-extrabold text-purple-400 mb-2">{user.socialScore}</div>
                    <div className="w-32 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-orange-400"
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

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{attendedMeetings}</div>
                      <div className="text-sm text-white/60">Attended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">{confirmedMeetings}</div>
                      <div className="text-sm text-white/60">Confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{noShowMeetings}</div>
                      <div className="text-sm text-white/60">No-Shows</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{totalMeetings}</div>
                      <div className="text-sm text-white/60">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border border-white/10 p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {attendanceRate.toFixed(1)}%
              </div>
              <div className="text-white/60">Attendance Rate</div>
            </div>
            <div className="border border-white/10 p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-teal-400" />
              </div>
              <div className="text-3xl font-bold text-teal-400 mb-2">
                {confirmationRate.toFixed(1)}%
              </div>
              <div className="text-white/60">Confirmation Rate</div>
            </div>
            <div className="border border-white/10 p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {user.createdMeetings.length}
              </div>
              <div className="text-white/60">Meetings Created</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Created Meetings */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Recent Meetings Created</h2>
              </div>
              {user.createdMeetings.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-white/20" />
                  <p>No meetings created yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.createdMeetings.map((m: { id: string; title: string; scheduledStart: Date }) => (
                    <div key={m.id} className="border border-white/10 p-3 rounded-lg">
                      <div className="font-semibold text-white">{m.title}</div>
                      <div className="text-sm text-white/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(m.scheduledStart).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attended Meetings */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-semibold">Recent Meetings Attended</h2>
              </div>
              {user.attendeeRecords.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-white/20" />
                  <p>No meetings attended yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.attendeeRecords.map((a: { id: string; meeting?: { title?: string; scheduledStart?: Date }; status: string }) => (
                    <div key={a.id} className="border border-white/10 p-3 rounded-lg">
                      <div className="font-semibold text-white">{a.meeting?.title || "(deleted meeting)"}</div>
                      <div className="text-sm text-white/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {a.meeting ? new Date(a.meeting.scheduledStart as Date).toLocaleDateString() : ""}
                      </div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                        a.status === "CONFIRMED" ? "bg-green-400/20 text-green-400" :
                        a.status === "NO_SHOW" ? "bg-red-400/20 text-red-400" :
                        "bg-yellow-400/20 text-yellow-400"
                      }`}>
                        {a.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 