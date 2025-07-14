import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      socialScore: number
      credits: number
      isOrganizer: boolean
    } & DefaultSession["user"]
  }
}
