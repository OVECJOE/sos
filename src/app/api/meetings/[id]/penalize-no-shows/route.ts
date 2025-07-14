import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
            attendees: { where: { status: "CONFIRMED" }, include: { user: true } },
            attendances: true,
        },
    })
    if (!meeting) {
        return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
    }
    if (meeting.organizerId !== session.user.id) {
        return NextResponse.json({ error: "Only the organizer can penalize no-shows" }, { status: 403 })
    }
    const attendedUserIds = new Set(meeting.attendances.map((a: { userId: string }) => a.userId))
    const noShows = meeting.attendees.filter((a: { userId: string }) => !attendedUserIds.has(a.userId))
    const penalized = []
    for (const attendee of noShows) {
        await prisma.user.update({
            where: { id: attendee.userId },
            data: { socialScore: Math.max(300, attendee.user.socialScore - meeting.scorePenalty) },
        })
        await prisma.attendee.update({
            where: { id: attendee.id },
            data: { status: "NO_SHOW" },
        })
        penalized.push({ userId: attendee.userId, name: attendee.user.name, email: attendee.user.email })
    }
    return NextResponse.json({ penalized, count: penalized.length })
}