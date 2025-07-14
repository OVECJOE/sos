import { z } from "zod"

export const createMeetingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  googleMeetLink: z.string().url(),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  confirmationDeadline: z.string().datetime(),
  scorePenalty: z.number().min(5).max(100).default(25)
})

export const confirmAttendanceSchema = z.object({
  meetingId: z.string(),
  userId: z.string()
})

export const recordAttendanceSchema = z.object({
  meetingId: z.string(),
  userId: z.string()
})
