export interface User {
    id: string
    name?: string
    email: string
    emailVerified?: Date
    image?: string
    socialScore: number
    credits: number
    isOrganizer: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UserProfile extends User {
    _count: {
        createdMeetings: number
        attendeeRecords: number
        attendanceRecords: number
    }
    stats: {
        totalMeetings: number
        attendedMeetings: number
        confirmedMeetings: number
        attendanceRate: number
        confirmationRate: number
    }
}

export interface UserStats {
    totalMeetings: number
    attendedMeetings: number
    confirmedMeetings: number
    attendanceRate: number
    confirmationRate: number
    averageScore: number
    rank: number
}

export interface LeaderboardEntry {
    id: string
    name: string
    email: string
    image?: string
    socialScore: number
    totalMeetings: number
    attendanceRate: number
    rank: number
}

export interface Transaction {
    id: string
    userId: string
    meetingId?: string
    type: TransactionType
    amount: number
    description: string
    createdAt: Date
}

export enum TransactionType {
    CREDIT_PURCHASE = "CREDIT_PURCHASE",
    CREDIT_GRANT = "CREDIT_GRANT",
    MEETING_COST = "MEETING_COST",
    REFUND = "REFUND"
}