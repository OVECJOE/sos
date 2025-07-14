export interface Meeting {
    id: string
    title: string
    description?: string
    googleMeetLink: string
    scheduledStart: Date
    scheduledEnd: Date
    createdAt: Date
    updatedAt: Date
    status: MeetingStatus
    organizerId: string
    shareableLink: string
    confirmationDeadline: Date
    scorePenalty: number
    organizer: {
        id: string
        name: string
        email: string
        image?: string
    }
    attendees: Attendee[]
    attendances: Attendance[]
    _count?: {
        attendees: number
        attendances: number
    }
}

export interface Attendee {
    id: string
    meetingId: string
    userId: string
    invitedAt: Date
    confirmedAt?: Date
    status: AttendeeStatus
    user: {
        id: string
        name: string
        email: string
        image?: string
        socialScore: number
    }
}

export interface Attendance {
    id: string
    meetingId: string
    userId: string
    attendedAt: Date
    leftAt?: Date
    duration?: number
    wasPresent: boolean
    user: {
        id: string
        name: string
        email: string
        image?: string
    }
}

export enum MeetingStatus {
    SCHEDULED = "SCHEDULED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export enum AttendeeStatus {
    INVITED = "INVITED",
    CONFIRMED = "CONFIRMED",
    DECLINED = "DECLINED",
    NO_SHOW = "NO_SHOW"
}

export interface CreateMeetingRequest {
    title: string
    description?: string
    googleMeetLink: string
    scheduledStart: string
    scheduledEnd: string
    confirmationDeadline: string
    scorePenalty?: number
}

export interface MeetingStats {
    totalMeetings: number
    upcomingMeetings: number
    completedMeetings: number
    attendanceRate: number
    averageScore: number
}
