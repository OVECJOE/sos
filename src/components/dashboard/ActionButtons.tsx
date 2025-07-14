"use client"
import { Button } from "@/components/ui/button"
import React from "react"
import { useRouter } from "next/navigation"

export default function ActionButtons() {
  const router = useRouter()
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:items-center">
      <Button
        variant="outline"
        className="flex-grow border border-purple-400/40 text-purple-400 hover:bg-purple-400/10 hover:text-white font-semibold px-6 py-3"
        onClick={() => router.push("/dashboard/meetings/create")}
      >
        Create Meeting
      </Button>
      <Button
        variant="outline"
        className="flex-grow border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 hover:text-white font-semibold px-6 py-3"
        onClick={() => router.push("/credits")}
      >
        Buy Credits
      </Button>
    </div>
  )
} 