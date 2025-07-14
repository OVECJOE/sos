"use client"

import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()
  const user = session?.user
  const isAuthenticated = status === "authenticated"
  return { session, user, status, isAuthenticated }
} 