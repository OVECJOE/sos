import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

export function generateShareableLink(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function calculateSocialScore(
  totalMeetings: number,
  attendedMeetings: number,
  confirmedMeetings: number
): number {
  const baseScore = 800
  const attendanceRate = totalMeetings > 0 ? attendedMeetings / totalMeetings : 1
  const confirmationRate = totalMeetings > 0 ? confirmedMeetings / totalMeetings : 1
  
  const attendanceBonus = (attendanceRate - 0.8) * 200
  const confirmationBonus = (confirmationRate - 0.8) * 100
  
  return Math.max(300, Math.min(850, baseScore + attendanceBonus + confirmationBonus))
}
