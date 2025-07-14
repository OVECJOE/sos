"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import React from "react"

export function SignOutButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <Button
      variant="outline"
      className={className || "border border-teal-400/40 text-teal-400 hover:bg-teal-400/10"}
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
    >
      {children || "Sign Out"}
    </Button>
  )
}
