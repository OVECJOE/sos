import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface UserWithCounts {
  id: string
  name: string | null
  email: string
  image: string | null
  socialScore: number
  createdAt: Date
  _count: {
    createdMeetings: number
    attendeeRecords: number
    attendanceRecords: number
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("q")
  const sortBy = searchParams.get("sortBy") || "socialScore"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const where = search ? {
    OR: [
      { name: { contains: search } },
      { email: { contains: search } }
    ]
  } : {}

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      socialScore: true,
      createdAt: true,
      _count: {
        select: {
          createdMeetings: true,
          attendeeRecords: true,
          attendanceRecords: true
        }
      }
    },
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit
  })

  const total = await prisma.user.count({ where })

  // Calculate attendance rates
  const usersWithStats = users.map((user: UserWithCounts) => {
    const attendanceRate = user._count.attendeeRecords > 0 
      ? (user._count.attendanceRecords / user._count.attendeeRecords) * 100 
      : 0

    return {
      ...user,
      attendanceRate: Math.round(attendanceRate)
    }
  })

  return NextResponse.json({
    success: true,
    data: usersWithStats,
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
