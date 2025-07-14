import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Attendee } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          createdMeetings: true,
          attendeeRecords: true,
          attendanceRecords: true
        }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Calculate detailed stats
  const attendeeRecords = await prisma.attendee.findMany({
    where: { userId: id },
    include: { meeting: true }
  })

  const confirmedMeetings = attendeeRecords.filter((record: Attendee) => record.status === "CONFIRMED").length
  const attendanceRate = attendeeRecords.length > 0 
    ? (user._count.attendanceRecords / attendeeRecords.length) * 100 
    : 0
  const confirmationRate = attendeeRecords.length > 0 
    ? (confirmedMeetings / attendeeRecords.length) * 100 
    : 0

  const userProfile = {
    ...user,
    stats: {
      totalMeetings: attendeeRecords.length,
      attendedMeetings: user._count.attendanceRecords,
      confirmedMeetings,
      attendanceRate: Math.round(attendanceRate),
      confirmationRate: Math.round(confirmationRate)
    }
  }

  return NextResponse.json({ success: true, data: userProfile })
}
