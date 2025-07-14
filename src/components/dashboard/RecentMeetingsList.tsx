import React from "react"
import { Meeting, Attendee } from "@/types/meeting"
import Link from "next/link"

interface RecentMeetingsListProps {
  meetings: Meeting[]
  attended: (Attendee & { meeting?: Meeting })[]
}

function isMeeting(m: Meeting | undefined): m is Meeting {
  return m !== undefined
}

export default function RecentMeetingsList({ meetings, attended }: RecentMeetingsListProps) {
  const allMeetings = [...meetings, ...attended.map(a => a.meeting)].filter(isMeeting)
  return (
    <div className="relative w-full flex flex-col gap-4 mt-2">
      <div className="text-xs uppercase tracking-widest text-white/60 mb-2">Recent Meetings</div>
      <div className="flex flex-col gap-4">
        {allMeetings
          .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
          .slice(0, 8)
          .map((meeting) => (
            <Link
              key={meeting.id}
              href={`/dashboard/meeting/${meeting.id}`}
              className="relative bg-black border-l border-white/10 flex flex-col md:flex-row items-start md:items-center p-4 pl-6 transition hover:bg-white/5 focus:bg-white/10 outline-none rounded-lg group cursor-pointer"
              tabIndex={0}
            >
              <div className="absolute left-0 top-6 w-1 h-4 bg-gradient-to-b from-white/20 to-transparent" style={{ zIndex: 1 }} />
              <div className="flex-1">
                <div className="font-semibold text-white text-base group-hover:text-purple-400 group-focus:text-purple-400 transition-colors">{meeting.title}</div>
                <div className="text-xs text-white/50 mt-1">{new Date(meeting.scheduledStart).toLocaleString()}</div>
              </div>
              <div className="ml-auto text-xs text-white/40 mt-2 md:mt-0">{meeting.status}</div>
            </Link>
          ))}
      </div>
    </div>
  )
}
