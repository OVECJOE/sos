import { prisma } from "./prisma"
import { calculateSocialScore } from "./utils"

export async function updateUserSocialScore(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      attendeeRecords: {
        include: {
          meeting: true
        }
      },
      attendanceRecords: true
    }
  })

  if (!user) return

  const totalMeetings = user.attendeeRecords.length
  const attendedMeetings = user.attendanceRecords.length
  const confirmedMeetings = user.attendeeRecords.filter(
    record => record.status === 'CONFIRMED'
  ).length

  const newScore = calculateSocialScore(totalMeetings, attendedMeetings, confirmedMeetings)

  await prisma.user.update({
    where: { id: userId },
    data: { socialScore: newScore }
  })

  return newScore
}

export async function penalizeNoShows(meetingId: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: {
      attendees: {
        where: { status: 'CONFIRMED' },
        include: { user: true }
      },
      attendances: true
    }
  })

  if (!meeting) return

  const attendedUserIds = meeting.attendances.map(a => a.userId)
  const noShowAttendees = meeting.attendees.filter(
    attendee => !attendedUserIds.includes(attendee.userId)
  )

  for (const attendee of noShowAttendees) {
    await prisma.user.update({
      where: { id: attendee.userId },
      data: {
        socialScore: Math.max(300, attendee.user.socialScore - meeting.scorePenalty)
      }
    })

    await prisma.attendee.update({
      where: { id: attendee.id },
      data: { status: 'NO_SHOW' }
    })
  }
}
