"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import type { Meeting, Attendee } from "@/types/meeting"

export default function AttendPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [state, setState] = useState<
    | "loading"
    | "not-found"
    | "not-confirmed"
    | "not-during"
    | "registering"
    | "redirecting"
    | "error"
  >("loading")
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!isAuthenticated) return
    setState("loading")
    fetch(`/api/meetings/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Meeting not found")
        return res.json()
      })
      .then((data) => {
        setMeeting(data.data as Meeting)
        // Check if user is confirmed attendee
        const attendee = data.data.attendees?.find((a: Attendee) => a.userId === user?.id)
        if (!attendee || attendee.status !== "CONFIRMED") {
          setState("not-confirmed")
        } else {
          // Check if during meeting
          const now = new Date()
          const start = new Date(data.data.scheduledStart)
          const end = new Date(data.data.scheduledEnd)
          if (now < start || now > end) {
            setState("not-during")
          } else {
            setState("registering")
          }
        }
      })
      .catch((e) => {
        setState("not-found")
        setError(e.message)
      })
  }, [isAuthenticated, params.id, user?.id])

  useEffect(() => {
    if (state !== "registering") return
    // Call attend API
    fetch(`/api/meetings/${params.id}/attend`, { method: "POST" })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok && data.redirect) {
          setState("redirecting")
          setTimeout(() => {
            window.location.href = data.redirect
          }, 1200)
        } else {
          setState("error")
          setError(data.error || "Failed to register attendance.")
        }
      })
      .catch((e) => {
        setState("error")
        setError(e.message)
      })
  }, [state, params.id])

  // UI for each state
  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="xl" variant="purple" className="mb-6" />
        <div className="text-lg text-white/80 font-semibold">Loading meeting info...</div>
      </div>
    )
  }
  if (state === "not-found") {
    return (
      <Card className="max-w-lg mx-auto mt-16 border-red-400/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-red-400">Meeting Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70 mb-4">This meeting does not exist or you do not have access.</div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }
  if (state === "not-confirmed") {
    return (
      <Card className="max-w-lg mx-auto mt-16 border-yellow-400/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-yellow-400">Attendance Not Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70 mb-4">You must confirm your attendance before joining this meeting.</div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/dashboard/meeting/${params.id}`}>Go to Meeting Page</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }
  if (state === "not-during") {
    return (
      <Card className="max-w-lg mx-auto mt-16 border-orange-400/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-orange-400">Meeting Not Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70 mb-4">You can only join during the scheduled meeting time.</div>
          {meeting && (
            <div className="text-xs text-white/40">Scheduled: {new Date(meeting.scheduledStart).toLocaleString()} - {new Date(meeting.scheduledEnd).toLocaleString()}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/dashboard/meeting/${params.id}`}>Back to Meeting</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }
  if (state === "registering") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="xl" variant="purple" className="mb-6" />
        <div className="text-lg text-white/80 font-semibold mb-2">Registering your attendance...</div>
        <div className="text-white/40 text-sm">Please wait, you will be redirected to the meeting shortly.</div>
      </div>
    )
  }
  if (state === "redirecting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="xl" variant="orange" className="mb-6" />
        <div className="text-lg text-orange-400 font-semibold mb-2">Redirecting to Google Meet...</div>
        <div className="text-white/40 text-sm">Thank you for confirming your attendance!</div>
      </div>
    )
  }
  if (state === "error") {
    return (
      <Card className="max-w-lg mx-auto mt-16 border-red-400/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-red-400">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70 mb-4">{error || "Something went wrong while registering your attendance."}</div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.refresh()}>Retry</Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }
  return null
} 