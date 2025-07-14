import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      select: { 
        scheduledStart: true, 
        scheduledEnd: true,
        googleMeetLink: true 
      }
    })

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }

    const now = new Date()
    const meetingStart = new Date(meeting.scheduledStart)
    const meetingEnd = new Date(meeting.scheduledEnd)

    // Allow attendance 15 minutes before and during meeting
    const allowedStart = new Date(meetingStart.getTime() - 15 * 60 * 1000)
    
    if (now < allowedStart || now > meetingEnd) {
      return NextResponse.json({ error: "Meeting not active" }, { status: 400 })
    }

    // Record attendance
    const attendance = await prisma.attendance.upsert({
      where: {
        meetingId_userId: {
          meetingId: id,
          userId: session.user.id
        }
      },
      update: {
        attendedAt: now,
        wasPresent: true
      },
      create: {
        meetingId: id,
        userId: session.user.id,
        attendedAt: now,
        wasPresent: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: attendance,
      redirect: meeting.googleMeetLink 
    })
  } catch (error) {
    return NextResponse.json(
        { error: (error as Error).message || "Failed to record attendance" }, 
        { status: 500 }
    )
  }
}
