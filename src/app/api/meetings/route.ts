import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { createMeetingSchema } from "@/lib/validations"
import { generateShareableLink } from "@/lib/utils"
import { MeetingStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status")
  const userId = searchParams.get("userId")

  const where = {
    ...(userId && { organizerId: userId }),
    ...(status && { status: status as MeetingStatus })
  }

  const meetings = await prisma.meeting.findMany({
    where,
    include: {
      organizer: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { attendees: true, attendances: true }
      }
    },
    orderBy: { scheduledStart: "desc" },
    skip: (page - 1) * limit,
    take: limit
  })

  const total = await prisma.meeting.count({ where })

  return NextResponse.json({
    success: true,
    data: meetings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = createMeetingSchema.parse(body)

    // Check if user has credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })

    if (!user || user.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Create meeting
    const meeting = await prisma.meeting.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        googleMeetLink: validatedData.googleMeetLink,
        scheduledStart: new Date(validatedData.scheduledStart),
        scheduledEnd: new Date(validatedData.scheduledEnd),
        confirmationDeadline: new Date(validatedData.confirmationDeadline),
        scorePenalty: validatedData.scorePenalty,
        organizerId: session.user.id,
        shareableLink: generateShareableLink()
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    })

    // Deduct credit and create transaction
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } }
    })

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        meetingId: meeting.id,
        type: "MEETING_COST",
        amount: -1,
        description: `Meeting created: ${meeting.title}`
      }
    })

    return NextResponse.json({ success: true, data: meeting })
  } catch (error) {
    return NextResponse.json(
        { error: (error as Error).message || "Failed to create meeting" }, 
        { status: 500 }
    )
  }
}
