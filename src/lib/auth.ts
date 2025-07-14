import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { socialScore: true, credits: true, isOrganizer: true }
        })
        if (dbUser) {
          session.user.socialScore = dbUser.socialScore
          session.user.credits = dbUser.credits
          session.user.isOrganizer = dbUser.isOrganizer
        }
      }
      return session
    },
  },
  events: {
    createUser: async ({ user }) => {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            credits: 5,
            isOrganizer: true 
          }
        })

        await prisma.transaction.create({
          data: {
            userId: user.id,
            type: "CREDIT_GRANT",
            amount: 5,
            description: "Welcome bonus"
          }
        })
      } catch (error) {
        console.error("Error setting up new user:", error)
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
  },
}
