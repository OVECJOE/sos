import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md border border-white/10 bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-center text-white/80">There was a problem signing you in. Please try again or contact support if the issue persists.</p>
          <Button asChild variant="outline" className="border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 hover:text-white">
            <Link href="/auth/signin">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 