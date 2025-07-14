"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export  default function ConfirmAttendanceButton({ meetingId }: { meetingId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const handleConfirm = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/meetings/${meetingId}/confirm`, {
          method: "POST",
        })
        if (res.ok) {
          toast.success("Attendance confirmed!")
          router.replace(`/dashboard/meeting/${meetingId}`)
        } else {
          toast.error("Failed to confirm attendance.")
        }
      } catch {
        toast.error("An error occurred.")
      } finally {
        setLoading(false)
      }
    }
    return (
      <Button onClick={handleConfirm} disabled={loading} className="w-full font-bold text-lg py-3 border border-purple-400/40 text-purple-400 hover:bg-purple-400/10">
        {loading ? "Confirming..." : "Confirm Attendance"}
      </Button>
    )
  }