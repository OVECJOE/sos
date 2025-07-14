import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: {
      organizer: {
        select: { id: true, name: true, email: true, image: true }
      },
      attendees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, socialScore: true }
          }
        }
      },
      attendances: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      }
    }
  })

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: meeting })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      select: { organizerId: true }
    })

    if (!meeting || meeting.organizerId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const body = await request.json()
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: body,
      include: {
        organizer: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: updatedMeeting })
  } catch (error) {
    return NextResponse.json(
        { error: (error as Error).message || "Failed to update meeting" }, 
        { status: 500 }
    )
  }
}
