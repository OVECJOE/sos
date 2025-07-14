"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import React, { useEffect } from "react"
import Logo from "@/components/common/Logo"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md border border-white/10 bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign in to <Logo /></CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-center text-white/80">Sign in with your Google account to schedule or join meetings and build your public social score.</p>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border border-purple-400/40 text-black hover:bg-purple-400/10 hover:text-white"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 