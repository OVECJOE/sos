import { MeetingStatus } from "./meeting"

export interface ApiResponse<T extends object> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T extends object> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export interface SearchParams {
    q?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    status?: MeetingStatus
    dateFrom?: string
    dateTo?: string
}
