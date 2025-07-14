import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.redirect("/auth/signin")
  }
  const { id } = await params
  const meeting = await prisma.meeting.findUnique({
    where: { id },
  })
  if (!meeting) {
    return NextResponse.redirect(`/meeting/${id}`)
  }
  const now = new Date()
  if (now > meeting.confirmationDeadline) {
    return NextResponse.redirect(`/meeting/${id}`)
  }
  // Find or create attendee
  const attendee = await prisma.attendee.findUnique({
    where: {
      meetingId_userId: {
        meetingId: meeting.id,
        userId: session.user.id,
      },
    },
  })
  if (!attendee) {
    await prisma.attendee.create({
      data: {
        meetingId: meeting.id,
        userId: session.user.id,
        confirmedAt: now,
        status: "CONFIRMED",
      },
    })
  } else if (attendee.status !== "CONFIRMED") {
    await prisma.attendee.update({
      where: { id: attendee.id },
      data: { confirmedAt: now, status: "CONFIRMED" },
    })
  }
  return NextResponse.redirect(`/meeting/${id}`)
}
