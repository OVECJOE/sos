import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import ConfirmAttendanceButton from "@/components/meeting/ConfirmAttendanceButton"
import Image from "next/image"

interface MeetingPageProps {
  params: Promise<{ id: string }>
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const session = await getServerSession(authOptions)
  const meeting = await prisma.meeting.findUnique({
    where: { id: (await params).id },
    include: {
      organizer: true,
      attendees: {
        where: { userId: session!.user.id },
        include: { user: { select: { name: true, email: true, image: true } } }
      }
    },
  })
  if (!meeting) notFound()
  const isConfirmed = meeting.attendees[0]?.status === "CONFIRMED"
  const isNoShow = meeting.attendees[0]?.status === "NO_SHOW"
  const canRSVP = !isConfirmed && new Date() < meeting.confirmationDeadline
  const isOrganizer = meeting.organizerId === session!.user.id
  const hasEnded = new Date() > meeting.scheduledEnd

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6 py-10 flex flex-col gap-8">
      <section className="flex flex-col gap-2 items-center text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Meeting <span className="text-purple-400">Details</span></h1>
        <p className="text-white/60 text-base md:text-lg max-w-xl">View all the information about your meeting, confirm attendance, or join when it is time.</p>
      </section>
      <Card className="w-full border border-white/10 bg-black/80 text-white p-6 md:p-10 shadow-xl rounded-2xl relative flex flex-col gap-6">
        <div className="flex flex-col gap-1 items-center text-center mb-2">
          <div className="text-2xl font-bold mb-1">{meeting.title}</div>
          <div className="text-white/60 text-sm mb-1">Organized by {meeting.organizer.name || meeting.organizer.email}</div>
          <div className="text-xs text-white/40 mb-1">{new Date(meeting.scheduledStart).toLocaleString()} - {new Date(meeting.scheduledEnd).toLocaleString()}</div>
          <div className="text-sm text-white/80 mb-2">{meeting.description}</div>
        </div>
        {isConfirmed && (
          <div className="text-purple-400 text-center font-bold mb-2">You have confirmed attendance for this meeting.</div>
        )}
        {isNoShow && (
          <div className="text-red-400 text-center font-bold mb-2">You were marked as a no-show for this meeting.</div>
        )}
        {canRSVP && (
          <ConfirmAttendanceButton meetingId={meeting.id} />
        )}
        {isConfirmed && (
          <Link href={`/dashboard/meeting/${meeting.id}/attend`}>
            <Button variant="outline" className="w-full mt-2 font-bold text-lg py-3 border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 hover:text-white">Join Meeting</Button>
          </Link>
        )}
        {isOrganizer && hasEnded && (
          <form action={`/api/meetings/${meeting.id}/penalize-no-shows`} method="POST" className="mt-6 flex flex-col items-center gap-2">
            <Button type="submit" variant="destructive" className="w-full font-bold text-lg py-3 border border-red-400/40 text-red-400 hover:bg-red-400/10">Penalize No-Shows</Button>
            <div className="text-xs text-white/40 text-center">This will mark all confirmed attendees who did not attend as no-shows and decrease their social score.</div>
          </form>
        )}
      </Card>
      {/* Attendees List */}
      <section className="w-full bg-black/70 border border-white/10 rounded-2xl shadow p-6 flex flex-col gap-4">
        <div className="text-lg font-semibold text-white mb-2">Attendees</div>
        {meeting.attendees.length === 0 ? (
          <div className="text-white/40 text-center">No attendees yet.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {meeting.attendees.map(att => (
              <li key={att.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition">
                {att.user.image ? (
                  <Image
                    src={att.user.image}
                    alt={att.user.name || att.user.email}
                    className="w-8 h-8 rounded-full border border-white/20 object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-bold border border-white/20">
                    {att.user.name ? att.user.name[0] : att.user.email[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{att.user.name || att.user.email}</div>
                  <div className="text-xs text-white/40 truncate">{att.user.email}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full
                  ${att.status === 'CONFIRMED' ? 'bg-purple-400/20 text-purple-400' :
                    att.status === 'INVITED' ? 'bg-blue-400/20 text-blue-400' :
                    att.status === 'DECLINED' ? 'bg-yellow-400/20 text-yellow-400' :
                    att.status === 'NO_SHOW' ? 'bg-red-400/20 text-red-400' :
                    'bg-white/10 text-white/60'}
                `}>
                  {att.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
} 